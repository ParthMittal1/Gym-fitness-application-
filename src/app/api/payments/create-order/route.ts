import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { isRazorpayConfigured, razorpayInstance } from "@/lib/razorpay";

// ---------------------------------------------------------------------------
// POST /api/payments/create-order
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Please sign in to choose a membership plan.",
          requiresAuth: true,
        },
        { status: 401 }
      );
    }

    // 2. Parse request payload
    const body = await request.json().catch(() => null);
    const planId = body?.planId;

    if (!planId) {
      return NextResponse.json(
        { success: false, message: "Plan ID is required." },
        { status: 400 }
      );
    }

    // 3. Fetch plan details from database
    const plan = await db.plan.findUnique({
      where: { id: planId },
    });

    if (!plan || !plan.active) {
      return NextResponse.json(
        { success: false, message: "The selected plan is not available." },
        { status: 404 }
      );
    }

    // ── 4. Mock / Sandbox Mode ─────────────────────────────────────────────
    if (!isRazorpayConfigured() || !razorpayInstance) {
      const mockOrderId = `order_mock_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 8)}`;

      // Create PENDING payment record
      await db.payment.create({
        data: {
          userId: session.user.id,
          amount: plan.price,
          currency: "INR",
          status: "PENDING",
          razorpayOrderId: mockOrderId,
          description: `GYM Fitness - ${plan.name} (${plan.tier}) Plan`,
        },
      });

      return NextResponse.json({
        success: true,
        isMock: true,
        orderId: mockOrderId,
        amount: plan.price,
        currency: "INR",
        keyId: "rzp_mock_sandbox",
        plan: {
          id: plan.id,
          name: plan.name,
          tier: plan.tier,
          price: plan.price,
          duration: plan.duration,
        },
        user: {
          name: session.user.name,
          email: session.user.email,
        },
      });
    }

    // ── 5. Live / Test Mode with Real Razorpay Client ──────────────────────
    const amountInPaise = Math.round(plan.price * 100);
    const receipt = `rcpt_${session.user.id.slice(-6)}_${Date.now().toString().slice(-6)}`;

    const razorpayOrder = await razorpayInstance.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt,
      notes: {
        userId: session.user.id,
        planId: plan.id,
        planName: plan.name,
      },
    });

    // Record PENDING payment in database
    await db.payment.create({
      data: {
        userId: session.user.id,
        amount: plan.price,
        currency: "INR",
        status: "PENDING",
        razorpayOrderId: razorpayOrder.id,
        description: `GYM Fitness - ${plan.name} (${plan.tier}) Plan`,
      },
    });

    return NextResponse.json({
      success: true,
      isMock: false,
      orderId: razorpayOrder.id,
      amount: plan.price,
      currency: "INR",
      keyId:
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
      plan: {
        id: plan.id,
        name: plan.name,
        tier: plan.tier,
        price: plan.price,
        duration: plan.duration,
      },
      user: {
        name: session.user.name,
        email: session.user.email,
      },
    });
  } catch (error) {
    console.error("[POST /api/payments/create-order]", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to initiate payment. Please try again.",
      },
      { status: 500 }
    );
  }
}
