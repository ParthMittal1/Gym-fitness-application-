import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const exercises = await db.exercise.findMany({
      select: {
        id: true,
        name: true,
        muscleGroup: true,
        equipment: true,
        difficulty: true,
      },
      orderBy: [{ muscleGroup: "asc" }, { name: "asc" }],
    });

    return NextResponse.json({ success: true, exercises });
  } catch (error) {
    console.error("[GET /api/exercises] Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch exercises" },
      { status: 500 }
    );
  }
}
