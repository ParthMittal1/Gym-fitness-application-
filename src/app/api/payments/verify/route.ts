import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { verifySignature, generateGymCardNumber } from "@/lib/razorpay";

// ---------------------------------------------------------------------------
// POST /api/payments/verify
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized request." },
        { status: 401 }
      );
    }

    // 2. Parse payload
    const body = await request.json().catch(() => null);
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      planId,
    } = body || {};

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !planId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required payment verification parameters.",
        },
        { status: 400 }
      );
    }

    // 3. Verify cryptographic or mock signature
    const isValid = verifySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValid) {
      // Mark payment as FAILED
      await db.payment.updateMany({
        where: { razorpayOrderId },
        data: { status: "FAILED" },
      });

      return NextResponse.json(
        { success: false, message: "Payment verification signature mismatch." },
        { status: 400 }
      );
    }

    // 4. Retrieve plan to know duration
    const plan = await db.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json(
        { success: false, message: "Plan not found." },
        { status: 404 }
      );
    }

    const durationMonths = plan.duration || 1;
    const durationDays = durationMonths * 30;
    const durationMs = durationDays * 24 * 60 * 60 * 1000;

    // 5. Check if user already has an active membership to extend, or create new
    const existingActiveMembership = await db.membership.findFirst({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
      },
      orderBy: { endDate: "desc" },
    });

    let targetMembership;

    if (existingActiveMembership && existingActiveMembership.endDate > new Date()) {
      // Extend existing membership
      const newEndDate = new Date(
        existingActiveMembership.endDate.getTime() + durationMs
      );

      targetMembership = await db.membership.update({
        where: { id: existingActiveMembership.id },
        data: {
          planId: plan.id,
          endDate: newEndDate,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create fresh new membership
      const cardNumber = generateGymCardNumber();
      const startDate = new Date();
      const endDate = new Date(Date.now() + durationMs);

      targetMembership = await db.membership.create({
        data: {
          userId: session.user.id,
          planId: plan.id,
          status: "ACTIVE",
          cardNumber,
          startDate,
          endDate,
          autoRenew: false,
        },
      });
    }

    // 6. Update payment transaction to SUCCESS
    await db.payment.updateMany({
      where: { razorpayOrderId },
      data: {
        status: "SUCCESS",
        razorpayPaymentId,
        razorpaySignature,
        membershipId: targetMembership.id,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified! Your membership is active.",
      membership: {
        id: targetMembership.id,
        cardNumber: targetMembership.cardNumber,
        status: targetMembership.status,
        startDate: targetMembership.startDate,
        endDate: targetMembership.endDate,
        planName: plan.name,
        tier: plan.tier,
      },
    });
  } catch (error) {
    console.error("[POST /api/payments/verify]", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to verify transaction. Please contact support.",
      },
      { status: 500 }
    );
  }
}
