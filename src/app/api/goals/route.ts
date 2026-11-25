import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// ---------------------------------------------------------------------------
// GET /api/goals - Fetch all fitness goals for current athlete
// ---------------------------------------------------------------------------
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const goals = await db.fitnessGoal.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, goals });
  } catch (error) {
    console.error("[GET /api/goals] Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch goals" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/goals - Create a new fitness goal
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);
    const { title, type, target, current = 0, unit = "kg", deadline } = body || {};

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { success: false, message: "Goal title is required" },
        { status: 400 }
      );
    }

    if (target === undefined || target === null || isNaN(Number(target))) {
      return NextResponse.json(
        { success: false, message: "A valid numerical target is required" },
        { status: 400 }
      );
    }

    const parsedTarget = parseFloat(Number(target).toFixed(2));
    const parsedCurrent = parseFloat(Number(current || 0).toFixed(2));
    const validDeadline = deadline ? new Date(deadline) : null;

    const newGoal = await db.fitnessGoal.create({
      data: {
        userId: session.user.id,
        title: title.trim(),
        type: type || "GENERAL",
        target: parsedTarget,
        current: parsedCurrent,
        unit: unit || "kg",
        deadline: validDeadline,
        status: parsedCurrent >= parsedTarget ? "ACHIEVED" : "IN_PROGRESS",
      },
    });

    return NextResponse.json(
      { success: true, goal: newGoal, message: "Goal created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/goals] Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create fitness goal" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// PATCH /api/goals - Update progress or status of a goal
// ---------------------------------------------------------------------------
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);
    const { id, current, status, title, target } = body || {};

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Goal ID is required" },
        { status: 400 }
      );
    }

    // Verify ownership
    const existing = await db.fitnessGoal.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "Goal not found or unauthorized" },
        { status: 404 }
      );
    }

    const updateData: {
      current?: number;
      status?: string;
      title?: string;
      target?: number;
    } = {};

    if (current !== undefined && !isNaN(Number(current))) {
      updateData.current = parseFloat(Number(current).toFixed(2));
      // Auto-set achieved if target reached and not deliberately abandoned
      if (updateData.current >= (target ?? existing.target) && existing.status !== "ABANDONED") {
        updateData.status = "ACHIEVED";
      }
    }

    if (status && ["IN_PROGRESS", "ACHIEVED", "ABANDONED"].includes(status)) {
      updateData.status = status;
    }

    if (title && typeof title === "string" && title.trim()) {
      updateData.title = title.trim();
    }

    if (target !== undefined && !isNaN(Number(target))) {
      updateData.target = parseFloat(Number(target).toFixed(2));
    }

    const updated = await db.fitnessGoal.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      goal: updated,
      message: "Goal updated successfully",
    });
  } catch (error) {
    console.error("[PATCH /api/goals] Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update goal" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/goals - Delete/archive a fitness goal
// ---------------------------------------------------------------------------
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Goal ID is required" },
        { status: 400 }
      );
    }

    const existing = await db.fitnessGoal.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "Goal not found or unauthorized" },
        { status: 404 }
      );
    }

    await db.fitnessGoal.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Goal removed successfully",
    });
  } catch (error) {
    console.error("[DELETE /api/goals] Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete goal" },
      { status: 500 }
    );
  }
}
