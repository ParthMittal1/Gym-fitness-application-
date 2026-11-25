import React, { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatINR } from "@/lib/razorpay";
import {
  Dumbbell,
  CreditCard,
  Target,
  LineChart,
  Flame,
  PlusCircle,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Trophy,
  Activity,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

async function DashboardOverviewContent() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const userId = session.user.id;

  // Query database in parallel for all athlete metrics
  const [membership, goals, workoutCount, recentWorkouts, latestProgress] =
    await Promise.all([
      db.membership.findFirst({
        where: { userId, status: "ACTIVE" },
        include: { plan: true },
        orderBy: { endDate: "desc" },
      }),
      db.fitnessGoal.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      db.workoutLog.count({
        where: { userId },
      }),
      db.workoutLog.findMany({
        where: { userId },
        include: { exercise: true },
        orderBy: { date: "desc" },
        take: 5,
      }),
      db.progressEntry.findFirst({
        where: { userId },
        orderBy: { date: "desc" },
      }),
    ]);

  const firstName = session.user.name?.split(" ")[0] || "Athlete";
  const hasActiveMembership =
    membership && new Date(membership.endDate) > new Date();

  return (
    <>
      {/* ── 1. Welcoming Banner ────────────────────────────────────────────── */}
      <div className="welcome-banner animate-fade-down">
        <div>
          <div className="badge badge-emerald" style={{ marginBottom: "var(--space-2)" }}>
            <Flame className="w-3.5 h-3.5" />
            <span>ATHLETE SPOTLIGHT</span>
          </div>
          <h1 style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-2)" }}>
            Welcome back, <span className="text-gradient">{firstName}!</span> 💪
          </h1>
          <p style={{ color: "var(--text-secondary)", maxWidth: "560px", fontSize: "var(--text-base)" }}>
            Consistency beats intensity. All 25+ nationwide gym locations are unlocked and
            ready for your training session today.
          </p>
        </div>

        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
          <Link href="/dashboard/workouts" className="btn btn-primary btn-lg">
            <PlusCircle className="w-4 h-4" />
            <span>Log Today&apos;s Workout</span>
          </Link>
          <Link href="/dashboard/membership" className="btn btn-ghost btn-lg">
            <CreditCard className="w-4 h-4" />
            <span>View Gym Card</span>
          </Link>
        </div>
      </div>

      {/* ── 2. Quick Action Cards (4-Column) ─────────────────────────────────── */}
      <div className="quick-actions-row">
        <Link href="/dashboard/workouts" className="quick-action-card">
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "var(--radius-lg)",
              background: "rgba(124, 58, 237, 0.15)",
              border: "1px solid rgba(124, 58, 237, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-violet-300)",
            }}
          >
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "var(--text-sm)" }}>
              Log Workout
            </div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
              Record sets & PRs
            </div>
          </div>
        </Link>

        <Link href="/dashboard/progress" className="quick-action-card">
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "var(--radius-lg)",
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-emerald-300)",
            }}
          >
            <LineChart className="w-5 h-5" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "var(--text-sm)" }}>
              Body Metrics
            </div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
              Weight & measurements
            </div>
          </div>
        </Link>

        <Link href="/dashboard/goals" className="quick-action-card">
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "var(--radius-lg)",
              background: "rgba(251, 191, 36, 0.15)",
              border: "1px solid rgba(251, 191, 36, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-amber-400)",
            }}
          >
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "var(--text-sm)" }}>
              Fitness Goals
            </div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
              Track milestones
            </div>
          </div>
        </Link>

        <Link href="/dashboard/membership" className="quick-action-card">
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "var(--radius-lg)",
              background: "rgba(56, 189, 248, 0.15)",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-sky-400)",
            }}
          >
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "var(--text-sm)" }}>
              Digital Pass
            </div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
              QR entry & details
            </div>
          </div>
        </Link>
      </div>

      {/* ── 3. Summary Metric Grid (4-Column) ─────────────────────────────────── */}
      <div className="summary-stats-grid">
        {/* Membership Status Card */}
        <div className="card" style={{ padding: "var(--space-6)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-3)" }}>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
              MEMBERSHIP
            </span>
            <span
              className={`badge ${
                hasActiveMembership ? "badge-emerald" : "badge-rose"
              }`}
            >
              {hasActiveMembership ? "ACTIVE" : "INACTIVE"}
            </span>
          </div>

          <div style={{ fontSize: "var(--text-2xl)", fontWeight: 800, marginBottom: "4px" }}>
            {hasActiveMembership ? `${membership.plan.name} Tier` : "No Active Pass"}
          </div>

          <p style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>
            {hasActiveMembership
              ? `Valid through ${new Date(membership.endDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}`
              : "Subscribe to unlock club biometric access"}
          </p>
        </div>

        {/* Workouts Logged */}
        <div className="card" style={{ padding: "var(--space-6)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-3)" }}>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
              WORKOUT LOGS
            </span>
            <Dumbbell className="w-4 h-4 text-violet" />
          </div>

          <div style={{ fontSize: "var(--text-3xl)", fontWeight: 800, marginBottom: "4px" }}>
            {workoutCount}
          </div>

          <p style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>
            Total gym training sessions recorded
          </p>
        </div>

        {/* Active Fitness Goals */}
        <div className="card" style={{ padding: "var(--space-6)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-3)" }}>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
              ACTIVE GOALS
            </span>
            <Target className="w-4 h-4 text-amber" />
          </div>

          <div style={{ fontSize: "var(--text-3xl)", fontWeight: 800, marginBottom: "4px" }}>
            {goals.length}
          </div>

          <p style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>
            {goals.length > 0 ? "Target milestones in progress" : "No active goals set yet"}
          </p>
        </div>

        {/* Latest Body Weight / Progress */}
        <div className="card" style={{ padding: "var(--space-6)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-3)" }}>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
              LATEST METRIC
            </span>
            <TrendingUp className="w-4 h-4 text-emerald" />
          </div>

          <div style={{ fontSize: "var(--text-3xl)", fontWeight: 800, marginBottom: "4px", color: "var(--color-emerald-300)" }}>
            {latestProgress?.weight ? `${latestProgress.weight} kg` : "--"}
          </div>

          <p style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>
            {latestProgress?.bodyFat
              ? `Body Fat: ${latestProgress.bodyFat}%`
              : "Update metrics in Progress tab"}
          </p>
        </div>
      </div>

      {/* ── 4. Recent Workouts Timeline & Goals Preview ──────────────────────── */}
      <div className="grid grid-cols-3" style={{ gap: "var(--space-8)" }}>
        {/* Left 2 Cols: Recent Workout Logs Timeline */}
        <div style={{ gridColumn: "span 2" }}>
          <div className="workout-timeline-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-6)" }}>
              <div>
                <h3 style={{ fontSize: "var(--text-xl)", marginBottom: "4px" }}>
                  Recent Workout Activity
                </h3>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                  Your latest logged gym sessions and personal bests
                </p>
              </div>

              <Link href="/dashboard/workouts" className="btn btn-ghost btn-sm">
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {recentWorkouts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "var(--space-12) 0" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "rgba(124, 58, 237, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto var(--space-4)",
                  }}
                >
                  <Dumbbell className="w-5 h-5 text-violet" />
                </div>
                <h4 style={{ fontSize: "var(--text-base)", marginBottom: "var(--space-2)" }}>
                  No Workouts Recorded Yet
                </h4>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", maxWidth: "380px", margin: "0 auto var(--space-4)" }}>
                  Track your sets, weights, and reps today to begin building your progress curve.
                </p>
                <Link href="/dashboard/workouts" className="btn btn-primary btn-sm">
                  <PlusCircle className="w-4 h-4" />
                  <span>Log First Workout</span>
                </Link>
              </div>
            ) : (
              <div>
                {recentWorkouts.map((log) => (
                  <div key={log.id} className="workout-item-row">
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "var(--radius-md)",
                          background: "rgba(124, 58, 237, 0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--color-violet-300)",
                        }}
                      >
                        <Dumbbell className="w-4 h-4" />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "var(--text-sm)" }}>
                          {log.exercise?.name || "Exercise"}
                        </div>
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                          {log.exercise?.muscleGroup} • {new Date(log.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700, fontSize: "var(--text-sm)", color: "var(--color-emerald-300)" }}>
                        {log.weight ? `${log.weight} kg` : "Bodyweight"}
                      </div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                        {log.sets} sets × {log.reps} reps
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Active Fitness Goals Preview */}
        <div>
          <div className="card" style={{ padding: "var(--space-6)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-5)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Target className="w-4 h-4 text-amber" />
                <h3 style={{ fontSize: "var(--text-base)" }}>Target Goals</h3>
              </div>
              <Link href="/dashboard/goals" className="btn btn-ghost btn-sm" style={{ padding: "4px 8px" }}>
                <PlusCircle className="w-3.5 h-3.5" />
              </Link>
            </div>

            {goals.length === 0 ? (
              <div style={{ textAlign: "center", padding: "var(--space-6) 0" }}>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginBottom: "var(--space-4)" }}>
                  Set target numbers for bodyweight, deadlift 1RM, or running times.
                </p>
                <Link href="/dashboard/goals" className="btn btn-secondary btn-sm btn-full" style={{ justifyContent: "center" }}>
                  <span>Set First Goal</span>
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                {goals.map((g) => {
                  const percent = Math.min(
                    100,
                    Math.round((g.current / (g.target || 1)) * 100)
                  );
                  return (
                    <div
                      key={g.id}
                      style={{
                        padding: "var(--space-3)",
                        background: "rgba(255, 255, 255, 0.02)",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border-subtle)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-xs)", marginBottom: "4px" }}>
                        <span style={{ fontWeight: 600 }}>{g.title}</span>
                        <span style={{ color: "var(--color-emerald-300)", fontWeight: 700 }}>
                          {g.current}/{g.target} {g.unit}
                        </span>
                      </div>
                      <div
                        style={{
                          height: "6px",
                          width: "100%",
                          background: "rgba(255,255,255,0.06)",
                          borderRadius: "999px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${percent}%`,
                            background: "var(--gradient-text)",
                            borderRadius: "999px",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function OverviewSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div className="card skeleton" style={{ minHeight: "180px" }} />
      <div className="grid grid-cols-4" style={{ gap: "var(--space-4)" }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card skeleton" style={{ minHeight: "120px" }} />
        ))}
      </div>
      <div className="card skeleton" style={{ minHeight: "320px" }} />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<OverviewSkeleton />}>
      <DashboardOverviewContent />
    </Suspense>
  );
}
