"use client";

import React, { useState } from "react";
import {
  Dumbbell,
  Plus,
  Flame,
  Calendar,
  Layers,
  Repeat,
  Scale,
  Clock,
  Trash2,
  Filter,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import "./workouts.css";

interface ExerciseOption {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string | null;
}

interface WorkoutLogItem {
  id: string;
  exerciseId: string;
  sets: number;
  reps: number;
  weight: number | null;
  duration: number | null;
  notes: string | null;
  date: string;
  exercise: {
    id: string;
    name: string;
    muscleGroup: string;
    equipment: string | null;
  };
}

interface WorkoutLoggerProps {
  exercises: ExerciseOption[];
  initialLogs: WorkoutLogItem[];
}

export function WorkoutLoggerClient({
  exercises,
  initialLogs,
}: WorkoutLoggerProps) {
  const [logs, setLogs] = useState<WorkoutLogItem[]>(initialLogs);
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [muscleFilter, setMuscleFilter] = useState<string>("ALL");

  // Form State
  const [selectedExerciseId, setSelectedExerciseId] = useState(
    exercises[0]?.id || ""
  );
  const [sets, setSets] = useState("3");
  const [reps, setReps] = useState("10");
  const [weight, setWeight] = useState("60");
  const [duration, setDuration] = useState("45");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const applyPreset = (s: number, r: number) => {
    setSets(s.toString());
    setReps(r.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExerciseId) {
      setErrorToast("Please select an exercise");
      return;
    }

    try {
      setSubmitting(true);
      setErrorToast(null);

      const res = await fetch("/api/workout-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exerciseId: selectedExerciseId,
          sets: parseInt(sets, 10),
          reps: parseInt(reps, 10),
          weight: weight ? parseFloat(weight) : null,
          duration: duration ? parseInt(duration, 10) : null,
          notes,
          date: new Date(date).toISOString(),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save workout log");
      }

      const data = await res.json();
      setLogs((prev) => [data.log, ...prev]);
      setSuccessToast("Workout session logged successfully!");
      setNotes("");

      setTimeout(() => setSuccessToast(null), 3500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorToast(err.message);
      } else {
        setErrorToast("Failed to log workout");
      }
      setTimeout(() => setErrorToast(null), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this workout record?")) return;

    setLogs((prev) => prev.filter((l) => l.id !== id));

    try {
      await fetch(`/api/workout-log?id=${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Failed to delete log:", err);
    }
  };

  // Metrics Calculations
  const totalWorkouts = logs.length;
  const totalReps = logs.reduce((sum, l) => sum + l.sets * l.reps, 0);
  const totalVolumeKg = logs.reduce(
    (sum, l) => sum + l.sets * l.reps * (l.weight || 0),
    0
  );
  const totalVolumeTons = (totalVolumeKg / 1000).toFixed(1);

  // Top muscle group
  const muscleCounts: Record<string, number> = {};
  logs.forEach((l) => {
    const mg = l.exercise?.muscleGroup || "Other";
    muscleCounts[mg] = (muscleCounts[mg] || 0) + 1;
  });
  const topMuscleGroup =
    Object.entries(muscleCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

  // Filtered Logs
  const filteredLogs = logs.filter((log) => {
    if (muscleFilter === "ALL") return true;
    return log.exercise?.muscleGroup === muscleFilter;
  });

  // Unique muscle groups in logs for filtering
  const availableMuscles = Array.from(
    new Set(exercises.map((e) => e.muscleGroup))
  ).sort();

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
      {/* Page Header */}
      <div className="workouts-header">
        <div>
          <div className="badge badge-emerald" style={{ marginBottom: "var(--space-2)" }}>
            <Dumbbell className="w-3.5 h-3.5" />
            <span>SESSION TRACKER</span>
          </div>
          <h1 style={{ fontSize: "var(--text-3xl)", fontWeight: 800 }}>
            Workout Logger & <span className="text-gradient">Training History</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", marginTop: "4px" }}>
            Log weights, sets, reps, and cumulative tonnage lifted to enforce progressive overload.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="workouts-stats-grid">
        <div className="workouts-stat-card">
          <div className="workouts-stat-icon" style={{ background: "rgba(16, 185, 129, 0.15)", color: "var(--color-emerald)" }}>
            <Flame className="w-5 h-5" />
          </div>
          <div className="workouts-stat-content">
            <h4>{totalWorkouts}</h4>
            <p>Exercises Logged</p>
          </div>
        </div>

        <div className="workouts-stat-card">
          <div className="workouts-stat-icon" style={{ background: "rgba(124, 58, 237, 0.15)", color: "#a78bfa" }}>
            <Repeat className="w-5 h-5" />
          </div>
          <div className="workouts-stat-content">
            <h4>{totalReps}</h4>
            <p>Total Reps</p>
          </div>
        </div>

        <div className="workouts-stat-card">
          <div className="workouts-stat-icon" style={{ background: "rgba(59, 130, 246, 0.15)", color: "#60a5fa" }}>
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="workouts-stat-content">
            <h4>{totalVolumeTons} <span style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>Tons</span></h4>
            <p>Volume Lifted</p>
          </div>
        </div>

        <div className="workouts-stat-card">
          <div className="workouts-stat-icon" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24" }}>
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="workouts-stat-content">
            <h4>{topMuscleGroup}</h4>
            <p>Focus Muscle</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Form on Left, History on Right */}
      <div className="workouts-main-grid">
        {/* Logger Entry Form */}
        <div className="logger-card">
          <h3 className="logger-card-title">
            <Plus className="w-4 h-4 text-emerald" />
            <span>Record New Set</span>
          </h3>

          {successToast && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                color: "var(--color-emerald)",
                padding: "var(--space-3)",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--text-xs)",
                marginBottom: "var(--space-4)",
              }}
            >
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successToast}</span>
            </div>
          )}

          {errorToast && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#f87171",
                padding: "var(--space-3)",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--text-xs)",
                marginBottom: "var(--space-4)",
              }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorToast}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="logger-form-group">
              <label>Select Exercise</label>
              <select
                value={selectedExerciseId}
                onChange={(e) => setSelectedExerciseId(e.target.value)}
                className="logger-select"
                required
              >
                {exercises.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name} ({ex.muscleGroup})
                  </option>
                ))}
              </select>
            </div>

            {/* Presets */}
            <div style={{ marginBottom: "var(--space-3)" }}>
              <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "6px" }}>
                Quick Presets:
              </span>
              <div className="logger-presets">
                <button
                  type="button"
                  onClick={() => applyPreset(3, 10)}
                  className="logger-preset-btn"
                >
                  3 × 10
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(4, 8)}
                  className="logger-preset-btn"
                >
                  4 × 8
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(5, 5)}
                  className="logger-preset-btn"
                >
                  5 × 5 (Power)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(3, 15)}
                  className="logger-preset-btn"
                >
                  3 × 15 (Burn)
                </button>
              </div>
            </div>

            <div className="logger-form-row">
              <div className="logger-form-group">
                <label>Sets</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  className="logger-input"
                  required
                />
              </div>

              <div className="logger-form-group">
                <label>Reps / Set</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  className="logger-input"
                  required
                />
              </div>
            </div>

            <div className="logger-form-row">
              <div className="logger-form-group">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="0 for bodyweight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="logger-input"
                />
              </div>

              <div className="logger-form-group">
                <label>Duration (mins)</label>
                <input
                  type="number"
                  placeholder="45"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="logger-input"
                />
              </div>
            </div>

            <div className="logger-form-group">
              <label>Workout Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="logger-input"
                required
              />
            </div>

            <div className="logger-form-group">
              <label>Coaching / Personal Notes</label>
              <input
                type="text"
                placeholder="Felt light on sets 1-2, RPE 8 on final set..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="logger-input"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-md"
              style={{ width: "100%", marginTop: "var(--space-2)" }}
              disabled={submitting}
            >
              {submitting ? "Logging Exercise..." : "Save Workout Log"}
            </button>
          </form>
        </div>

        {/* History List */}
        <div className="workout-history-wrap">
          <div className="workout-history-header">
            <h3 style={{ fontSize: "var(--text-xl)", fontWeight: 700 }}>
              Recent Training Logs ({filteredLogs.length})
            </h3>

            {/* Muscle Filter */}
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <Filter className="w-3.5 h-3.5 text-muted" />
              <select
                value={muscleFilter}
                onChange={(e) => setMuscleFilter(e.target.value)}
                className="logger-select"
                style={{ width: "auto", padding: "6px 12px", fontSize: "var(--text-xs)" }}
              >
                <option value="ALL">All Muscle Groups</option>
                {availableMuscles.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredLogs.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "var(--space-12) var(--space-4)",
                background: "var(--bg-card)",
                border: "1px dashed var(--border-subtle)",
                borderRadius: "var(--radius-xl)",
                color: "var(--text-muted)",
              }}
            >
              <Dumbbell className="w-8 h-8 text-muted" style={{ margin: "0 auto var(--space-3)" }} />
              <p style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                No training logs recorded for this filter.
              </p>
              <p style={{ fontSize: "var(--text-xs)", marginTop: "4px" }}>
                Use the form on the left to record your first set!
              </p>
            </div>
          ) : (
            filteredLogs.map((log) => {
              const sessionVolume = log.sets * log.reps * (log.weight || 0);

              return (
                <div key={log.id} className="workout-log-item">
                  <div className="workout-log-left">
                    <div className="workout-log-iconBox">
                      <Dumbbell className="w-5 h-5" />
                    </div>
                    <div className="workout-log-details">
                      <h4>{log.exercise?.name || "Exercise"}</h4>
                      <div className="workout-log-meta">
                        <span className="badge badge-violet" style={{ fontSize: "0.65rem", padding: "1px 6px" }}>
                          {log.exercise?.muscleGroup}
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(log.date).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        {log.notes && (
                          <>
                            <span>•</span>
                            <span style={{ fontStyle: "italic", color: "var(--text-secondary)" }}>
                              &ldquo;{log.notes}&rdquo;
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="workout-log-stats">
                    <div className="workout-stat-badge">
                      <div className="workout-stat-val">
                        {log.sets} × {log.reps}
                      </div>
                      <div className="workout-stat-label">Sets × Reps</div>
                    </div>

                    <div className="workout-stat-badge">
                      <div className="workout-stat-val" style={{ color: "var(--color-emerald)" }}>
                        {log.weight ? `${log.weight} kg` : "Bodyweight"}
                      </div>
                      <div className="workout-stat-label">
                        {sessionVolume > 0 ? `Vol: ${sessionVolume} kg` : "Load"}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(log.id)}
                      className="workout-log-delete-btn"
                      title="Delete log"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
