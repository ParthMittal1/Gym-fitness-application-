import React, { Suspense } from "react";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { WorkoutLoggerClient } from "./WorkoutLoggerClient";

export const metadata: Metadata = {
  title: "Workout Logger & Training History | GYM Fitness",
  description: "Record daily gym sets, reps, and weights to manage progressive overload.",
};

async function WorkoutLoggerContent() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard/workouts");
  }

  // Fetch exercises for dropdown and user's past workout logs
  const [exercises, logs] = await Promise.all([
    db.exercise.findMany({
      select: {
        id: true,
        name: true,
        muscleGroup: true,
        equipment: true,
      },
      orderBy: [{ muscleGroup: "asc" }, { name: "asc" }],
    }),
    db.workoutLog.findMany({
      where: { userId: session.user.id },
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
      orderBy: { date: "desc" },
      take: 50,
    }),
  ]);

  // Format dates to ISO strings for client component serializability
  const serializedLogs = logs.map((log) => ({
    ...log,
    date: log.date.toISOString(),
  }));

  return (
    <WorkoutLoggerClient
      exercises={exercises}
      initialLogs={serializedLogs}
    />
  );
}

function WorkoutLoggerSkeleton() {
  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
      <div className="skeleton" style={{ height: "60px", marginBottom: "var(--space-6)", borderRadius: "var(--radius-lg)" }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-4)", marginBottom: "var(--space-8)" }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton" style={{ height: "90px", borderRadius: "var(--radius-xl)" }} />
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: "var(--space-8)" }}>
        <div className="skeleton" style={{ height: "450px", borderRadius: "var(--radius-2xl)" }} />
        <div className="skeleton" style={{ height: "450px", borderRadius: "var(--radius-2xl)" }} />
      </div>
    </div>
  );
}

export default function WorkoutsDashboardPage() {
  return (
    <Suspense fallback={<WorkoutLoggerSkeleton />}>
      <WorkoutLoggerContent />
    </Suspense>
  );
}
