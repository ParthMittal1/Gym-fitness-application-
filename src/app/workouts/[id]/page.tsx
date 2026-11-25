import React, { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Clock,
  Flame,
  Dumbbell,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  PlayCircle,
  Timer,
  Layers,
  Repeat,
} from "lucide-react";

interface WorkoutDetailProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: WorkoutDetailProps): Promise<Metadata> {
  const { id } = await params;
  const plan = await db.workoutPlan.findFirst({
    where: {
      OR: [{ id }, { slug: id }],
    },
  });

  return {
    title: plan ? `${plan.name} Routine | GYM Fitness` : "Workout Routine",
    description: plan?.description || "Detailed workout routine mapping exercises, sets, reps, and instructions.",
  };
}

async function WorkoutDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Support searching by either UUID/CUID or slug
  const plan = await db.workoutPlan.findFirst({
    where: {
      OR: [{ id }, { slug: id }],
    },
    include: {
      exercises: {
        include: { exercise: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!plan) {
    notFound();
  }

  return (
    <div>
      {/* ── Breadcrumb & Back ──────────────────────────────────────────────── */}
      <div style={{ marginBottom: "var(--space-6)" }}>
        <Link
          href="/workouts"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "var(--text-xs)",
            color: "var(--text-secondary)",
            textDecoration: "none",
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Workout Plans</span>
        </Link>
      </div>

      {/* ── Plan Header Card ───────────────────────────────────────────────── */}
      <div
        className="card-glow"
        style={{
          padding: "var(--space-10) var(--space-8)",
          marginBottom: "var(--space-12)",
          background: "linear-gradient(145deg, rgba(124, 58, 237, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%), #10111d",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "var(--space-4)" }}>
          <div style={{ maxWidth: "700px" }}>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "var(--space-3)" }}>
              <span className="badge badge-emerald">{plan.category}</span>
              <span
                className={`badge ${
                  plan.difficulty === "ADVANCED"
                    ? "badge-rose"
                    : plan.difficulty === "INTERMEDIATE"
                    ? "badge-amber"
                    : "badge-muted"
                }`}
              >
                {plan.difficulty}
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)", marginBottom: "var(--space-3)" }}>
              {plan.name}
            </h1>

            <p style={{ fontSize: "var(--text-base)", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-6)" }}>
              {plan.description}
            </p>

            {/* Quick Metrics */}
            <div style={{ display: "flex", gap: "var(--space-6)", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Clock className="w-4 h-4 text-violet" />
                <span style={{ fontSize: "var(--text-sm)", color: "var(--text-primary)" }}>
                  Duration: <strong>{plan.duration} mins</strong>
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Flame className="w-4 h-4 text-rose" />
                <span style={{ fontSize: "var(--text-sm)", color: "var(--text-primary)" }}>
                  Estimated Burn: <strong>{plan.calories || 400} kcal</strong>
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Dumbbell className="w-4 h-4 text-emerald" />
                <span style={{ fontSize: "var(--text-sm)", color: "var(--text-primary)" }}>
                  Prescribed Movements: <strong>{plan.exercises.length}</strong>
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <Link href="/dashboard/workouts" className="btn btn-primary btn-lg">
              <PlayCircle className="w-5 h-5" />
              <span>Start Routine in Tracker</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Exercise Routine Sequence ──────────────────────────────────────── */}
      <div style={{ marginBottom: "var(--space-12)" }}>
        <h2 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-6)" }}>
          Prescribed Exercise Sequence ({plan.exercises.length} Movements)
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          {plan.exercises.map((item, idx) => {
            const ex = item.exercise;
            let tipsList: string[] = [];
            if (ex.tips) {
              try {
                tipsList = JSON.parse(ex.tips);
              } catch {
                tipsList = [];
              }
            }

            return (
              <div
                key={item.id}
                className="card"
                style={{
                  padding: "var(--space-6) var(--space-8)",
                  background: "rgba(17, 18, 30, 0.9)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "var(--space-4)", marginBottom: "var(--space-4)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "var(--radius-md)",
                        background: "rgba(124, 58, 237, 0.2)",
                        border: "1px solid rgba(124, 58, 237, 0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        color: "#fff",
                        fontSize: "var(--text-sm)",
                      }}
                    >
                      #{idx + 1}
                    </div>

                    <div>
                      <h3 style={{ fontSize: "var(--text-xl)", marginBottom: "2px" }}>
                        {ex.name}
                      </h3>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        <span className="badge badge-emerald" style={{ fontSize: "0.65rem" }}>
                          {ex.muscleGroup}
                        </span>
                        <span className="badge badge-muted" style={{ fontSize: "0.65rem" }}>
                          {ex.equipment || "Bodyweight"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Sets / Reps / Rest Badge Cluster */}
                  <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 14px",
                        borderRadius: "var(--radius-md)",
                        background: "rgba(124, 58, 237, 0.12)",
                        border: "1px solid rgba(124, 58, 237, 0.25)",
                        fontSize: "var(--text-xs)",
                        fontWeight: 700,
                      }}
                    >
                      <Layers className="w-3.5 h-3.5 text-violet" />
                      <span>{item.sets} Sets</span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 14px",
                        borderRadius: "var(--radius-md)",
                        background: "rgba(16, 185, 129, 0.12)",
                        border: "1px solid rgba(16, 185, 129, 0.25)",
                        fontSize: "var(--text-xs)",
                        fontWeight: 700,
                        color: "var(--color-emerald-300)",
                      }}
                    >
                      <Repeat className="w-3.5 h-3.5" />
                      <span>{item.reps} Reps</span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 14px",
                        borderRadius: "var(--radius-md)",
                        background: "rgba(251, 191, 36, 0.12)",
                        border: "1px solid rgba(251, 191, 36, 0.25)",
                        fontSize: "var(--text-xs)",
                        fontWeight: 700,
                        color: "#fde68a",
                      }}
                    >
                      <Timer className="w-3.5 h-3.5" />
                      <span>{item.restSeconds}s Rest</span>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                {ex.instructions && (
                  <div style={{ marginBottom: "var(--space-4)" }}>
                    <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "4px" }}>
                      EXECUTION STEPS
                    </div>
                    <p style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)", whiteSpace: "pre-line", lineHeight: 1.6 }}>
                      {ex.instructions}
                    </p>
                  </div>
                )}

                {/* Tips */}
                {tipsList.length > 0 && (
                  <div
                    style={{
                      padding: "var(--space-3) var(--space-4)",
                      background: "rgba(255, 255, 255, 0.02)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-subtle)",
                      fontSize: "var(--text-xs)",
                    }}
                  >
                    <span style={{ fontWeight: 700, color: "var(--color-violet-200)" }}>Coach Tip: </span>
                    <span style={{ color: "var(--text-secondary)" }}>{tipsList[0]}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default async function WorkoutDetailPage({ params }: WorkoutDetailProps) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1, paddingBlock: "var(--space-12) var(--space-20)" }}>
        <div className="container">
          <Suspense fallback={<div className="card skeleton" style={{ minHeight: "450px" }} />}>
            <WorkoutDetailContent params={params} />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
