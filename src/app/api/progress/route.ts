import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// ---------------------------------------------------------------------------
// GET /api/progress - Fetch athlete's body metrics and historical progress
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

    const entries = await db.progressEntry.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "asc" },
    });

    return NextResponse.json({ success: true, entries });
  } catch (error) {
    console.error("[GET /api/progress] Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch progress entries" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/progress - Record new body metrics entry
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
    const { weight, bodyFat, chest, waist, hips, biceps, thighs, notes, date } = body || {};

    const parseNum = (val: unknown) => {
      if (val === undefined || val === null || val === "") return null;
      const n = Number(val);
      return isNaN(n) ? null : parseFloat(n.toFixed(2));
    };

    const parsedWeight = parseNum(weight);
    const parsedBodyFat = parseNum(bodyFat);
    const parsedChest = parseNum(chest);
    const parsedWaist = parseNum(waist);
    const parsedHips = parseNum(hips);
    const parsedBiceps = parseNum(biceps);
    const parsedThighs = parseNum(thighs);

    if (parsedWeight === null && parsedBodyFat === null) {
      return NextResponse.json(
        { success: false, message: "Please enter at least Weight or Body Fat %" },
        { status: 400 }
      );
    }

    const entryDate = date ? new Date(date) : new Date();

    const newEntry = await db.progressEntry.create({
      data: {
        userId: session.user.id,
        weight: parsedWeight,
        bodyFat: parsedBodyFat,
        chest: parsedChest,
        waist: parsedWaist,
        hips: parsedHips,
        biceps: parsedBiceps,
        thighs: parsedThighs,
        notes: notes ? notes.trim() : null,
        date: entryDate,
      },
    });

    return NextResponse.json(
      { success: true, entry: newEntry, message: "Progress logged successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/progress] Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to record progress entry" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/progress - Delete a progress entry
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
        { success: false, message: "Entry ID is required" },
        { status: 400 }
      );
    }

    const existing = await db.progressEntry.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "Entry not found or unauthorized" },
        { status: 404 }
      );
    }

    await db.progressEntry.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Progress record removed successfully",
    });
  } catch (error) {
    console.error("[DELETE /api/progress] Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete progress entry" },
      { status: 500 }
    );
  }
}
