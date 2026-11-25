import React, { Suspense } from "react";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ExercisesExplorer } from "@/components/ExercisesExplorer";
import { Dumbbell, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Exercise Database & Movement Library | GYM Fitness",
  description:
    "Comprehensive directory of strength, barbell, dumbbell, and bodyweight exercises with step-by-step biomechanical coaching cues.",
};

async function ExercisesData() {
  const exercises = await db.exercise.findMany({
    orderBy: [{ muscleGroup: "asc" }, { name: "asc" }],
  });

  return <ExercisesExplorer exercises={exercises} />;
}

function ExercisesLoadingSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div className="card skeleton" style={{ minHeight: "140px" }} />
      <div className="grid grid-cols-3" style={{ gap: "var(--space-6)" }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card skeleton" style={{ minHeight: "260px" }} />
        ))}
      </div>
    </div>
  );
}

export default function ExercisesPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1, paddingBlock: "var(--space-12) var(--space-20)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto var(--space-12)" }}>
            <div className="badge badge-violet" style={{ marginBottom: "var(--space-3)" }}>
              <Dumbbell className="w-3.5 h-3.5" />
              <span>MOVEMENT ENCYCLOPEDIA</span>
            </div>
            <h1 style={{ fontSize: "clamp(2.4rem, 5vw, 3.6rem)", marginBottom: "var(--space-4)" }}>
              Exercise Library & <span className="text-gradient">Coaching Cues</span>
            </h1>
            <p style={{ fontSize: "var(--text-lg)", color: "var(--text-secondary)" }}>
              Browse precision compound lifts, machine isolations, and bodyweight movements
              with step-by-step instructions designed by ACSM certified coaches.
            </p>
          </div>

          <Suspense fallback={<ExercisesLoadingSkeleton />}>
            <ExercisesData />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
