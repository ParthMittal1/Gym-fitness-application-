import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// ---------------------------------------------------------------------------
// GET /api/workout-log - Fetch user's workout logs with exercise details
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

    const logs = await db.workoutLog.findMany({
      where: { userId: session.user.id },
      include: {
        exercise: {
          select: {
            id: true,
            name: true,
            muscleGroup: true,
            equipment: true,
            difficulty: true,
          },
        },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ success: true, logs });
  } catch (error) {
    console.error("[GET /api/workout-log] Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch workout logs" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/workout-log - Log a completed workout set/exercise
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
    const { exerciseId, sets, reps, weight, duration, notes, date } = body || {};

    if (!exerciseId) {
      return NextResponse.json(
        { success: false, message: "Exercise selection is required" },
        { status: 400 }
      );
    }

    const numSets = parseInt(sets, 10);
    const numReps = parseInt(reps, 10);

    if (isNaN(numSets) || numSets <= 0 || isNaN(numReps) || numReps <= 0) {
      return NextResponse.json(
        { success: false, message: "Sets and Reps must be positive numbers" },
        { status: 400 }
      );
    }

    // Verify exercise exists
    const exercise = await db.exercise.findUnique({
      where: { id: exerciseId },
    });

    if (!exercise) {
      return NextResponse.json(
        { success: false, message: "Selected exercise not found" },
        { status: 404 }
      );
    }

    const parsedWeight = weight !== undefined && weight !== null && weight !== "" ? parseFloat(Number(weight).toFixed(2)) : null;
    const parsedDuration = duration ? parseInt(duration, 10) : null;
    const logDate = date ? new Date(date) : new Date();

    const newLog = await db.workoutLog.create({
      data: {
        userId: session.user.id,
        exerciseId,
        sets: numSets,
        reps: numReps,
        weight: parsedWeight,
        duration: parsedDuration,
        notes: notes ? notes.trim() : null,
        date: logDate,
      },
      include: {
        exercise: {
          select: {
            id: true,
            name: true,
            muscleGroup: true,
            equipment: true,
          },
        },
      },
    });

    return NextResponse.json(
      { success: true, log: newLog, message: "Workout logged successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/workout-log] Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to record workout log" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/workout-log - Remove a workout log entry
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
        { success: false, message: "Log ID is required" },
        { status: 400 }
      );
    }

    const existing = await db.workoutLog.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "Log not found or unauthorized" },
        { status: 404 }
      );
    }

    await db.workoutLog.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Workout log removed successfully",
    });
  } catch (error) {
    console.error("[DELETE /api/workout-log] Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete workout log" },
      { status: 500 }
    );
  }
}
