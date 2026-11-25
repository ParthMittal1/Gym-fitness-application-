import React, { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Flame,
  Clock,
  Zap,
  ArrowRight,
  Sparkles,
  Dumbbell,
  Target,
  Trophy,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Workout Plans & Routines | GYM Fitness",
  description:
    "Explore periodized workout plans engineered for strength, hypertrophy, and fat burn across all fitness levels.",
};

async function WorkoutsCatalogContent() {
  const workoutPlans = await db.workoutPlan.findMany({
    include: {
      exercises: {
        include: { exercise: true },
      },
    },
    orderBy: { duration: "asc" },
  });

  return (
    <div className="grid grid-cols-3" style={{ gap: "var(--space-8)" }}>
      {workoutPlans.map((plan) => (
        <div
          key={plan.id}
          className="card-gradient"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "var(--space-8)",
          }}
        >
          <div>
            {/* Header Pills */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "var(--space-4)",
              }}
            >
              <span className="badge badge-emerald" style={{ fontSize: "0.68rem" }}>
                {plan.category}
              </span>
              <span
                className={`badge ${
                  plan.difficulty === "ADVANCED"
                    ? "badge-rose"
                    : plan.difficulty === "INTERMEDIATE"
                    ? "badge-amber"
                    : "badge-muted"
                }`}
                style={{ fontSize: "0.68rem" }}
              >
                {plan.difficulty}
              </span>
            </div>

            {/* Plan Title */}
            <h3 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-3)" }}>
              {plan.name}
            </h3>

            {/* Plan Description */}
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--text-secondary)",
                marginBottom: "var(--space-6)",
                lineHeight: 1.6,
              }}
            >
              {plan.description}
            </p>

            {/* Metrics Row: Duration, Calories, Movements Count */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "var(--space-2)",
                padding: "var(--space-3)",
                background: "rgba(255, 255, 255, 0.03)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-subtle)",
                textAlign: "center",
                marginBottom: "var(--space-6)",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                  <Clock className="w-3.5 h-3.5 text-violet" />
                  <span style={{ fontWeight: 800, fontSize: "var(--text-sm)" }}>
                    {plan.duration}m
                  </span>
                </div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                  DURATION
                </div>
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                  <Flame className="w-3.5 h-3.5 text-rose" />
                  <span style={{ fontWeight: 800, fontSize: "var(--text-sm)" }}>
                    {plan.calories || 350}
                  </span>
                </div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                  KCAL BURN
                </div>
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                  <Dumbbell className="w-3.5 h-3.5 text-emerald" />
                  <span style={{ fontWeight: 800, fontSize: "var(--text-sm)" }}>
                    {plan.exercises.length}
                  </span>
                </div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                  EXERCISES
                </div>
              </div>
            </div>

            {/* Exercise preview tags */}
            <div style={{ marginBottom: "var(--space-6)" }}>
              <div
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginBottom: "6px",
                  letterSpacing: "0.08em",
                }}
              >
                MOVEMENTS INCLUDED
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {plan.exercises.slice(0, 4).map((we) => (
                  <span
                    key={we.id}
                    className="location-amenity-pill"
                    style={{ fontSize: "0.68rem" }}
                  >
                    {we.exercise.name}
                  </span>
                ))}
                {plan.exercises.length > 4 && (
                  <span className="location-amenity-pill" style={{ fontSize: "0.68rem" }}>
                    +{plan.exercises.length - 4} more
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <Link
            href={`/workouts/${plan.id}`}
            className="btn btn-primary btn-lg btn-full"
            style={{ justifyContent: "center" }}
          >
            <span>View Routine & Sets</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ))}
    </div>
  );
}

function WorkoutsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-3" style={{ gap: "var(--space-8)" }}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="card skeleton" style={{ minHeight: "380px" }} />
      ))}
    </div>
  );
}

export default function WorkoutsPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1, paddingBlock: "var(--space-12) var(--space-20)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto var(--space-12)" }}>
            <div className="badge badge-emerald" style={{ marginBottom: "var(--space-3)" }}>
              <Trophy className="w-3.5 h-3.5" />
              <span>STRUCTURED PROGRAMMING</span>
            </div>
            <h1 style={{ fontSize: "clamp(2.4rem, 5vw, 3.6rem)", marginBottom: "var(--space-4)" }}>
              Curated <span className="text-gradient">Workout Routines</span>
            </h1>
            <p style={{ fontSize: "var(--text-lg)", color: "var(--text-secondary)" }}>
              Scientifically periodized programs targeting muscle hypertrophy, explosive
              strength, and cardiovascular conditioning.
            </p>
          </div>

          <Suspense fallback={<WorkoutsLoadingSkeleton />}>
            <WorkoutsCatalogContent />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
