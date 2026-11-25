"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Target,
  Plus,
  Trophy,
  CheckCircle2,
  Clock,
  Trash2,
  ArrowUpRight,
  Sparkles,
  Flame,
  X,
  AlertCircle,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import "./goals.css";

interface FitnessGoal {
  id: string;
  type: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline: string | null;
  status: "IN_PROGRESS" | "ACHIEVED" | "ABANDONED";
  createdAt: string;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<FitnessGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "IN_PROGRESS" | "ACHIEVED">("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    type: "STRENGTH",
    target: "",
    current: "",
    unit: "kg",
    deadline: "",
  });

  const fetchGoals = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/goals");
      if (res.ok) {
        const data = await res.json();
        setGoals(data.goals || []);
      }
    } catch (err) {
      console.error("Failed to fetch goals:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.target) {
      setErrorMsg("Please provide a title and target value.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg(null);
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create goal");
      }

      setIsModalOpen(false);
      setFormData({
        title: "",
        type: "STRENGTH",
        target: "",
        current: "",
        unit: "kg",
        deadline: "",
      });
      await fetchGoals();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Failed to create goal");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProgress = async (id: string, delta: number) => {
    const targetGoal = goals.find((g) => g.id === id);
    if (!targetGoal) return;

    const newCurrent = Math.max(0, parseFloat((targetGoal.current + delta).toFixed(2)));
    const newStatus = newCurrent >= targetGoal.target ? "ACHIEVED" : targetGoal.status === "ACHIEVED" ? "IN_PROGRESS" : targetGoal.status;

    // Optimistic UI update
    setGoals((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, current: newCurrent, status: newStatus as FitnessGoal["status"] } : g
      )
    );

    try {
      await fetch("/api/goals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, current: newCurrent, status: newStatus }),
      });
    } catch (err) {
      console.error("Failed to update goal progress:", err);
      fetchGoals();
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "ACHIEVED" ? "IN_PROGRESS" : "ACHIEVED";

    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status: nextStatus as FitnessGoal["status"] } : g))
    );

    try {
      await fetch("/api/goals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
      });
    } catch (err) {
      console.error("Failed to toggle status:", err);
      fetchGoals();
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (!confirm("Are you sure you want to remove this fitness goal?")) return;

    setGoals((prev) => prev.filter((g) => g.id !== id));

    try {
      await fetch(`/api/goals?id=${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Failed to delete goal:", err);
      fetchGoals();
    }
  };

  // Metrics
  const totalGoals = goals.length;
  const inProgressGoals = goals.filter((g) => g.status === "IN_PROGRESS").length;
  const achievedGoals = goals.filter((g) => g.status === "ACHIEVED").length;
  const avgCompletion =
    totalGoals > 0
      ? Math.round(
          goals.reduce((acc, g) => acc + Math.min(100, (g.current / (g.target || 1)) * 100), 0) /
            totalGoals
        )
      : 0;

  const filteredGoals = goals.filter((g) => {
    if (filter === "IN_PROGRESS") return g.status === "IN_PROGRESS";
    if (filter === "ACHIEVED") return g.status === "ACHIEVED";
    return true;
  });

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
      {/* Page Header */}
      <div className="goals-page-header">
        <div>
          <div className="badge badge-violet" style={{ marginBottom: "var(--space-2)" }}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>ATHLETE TARGETS</span>
          </div>
          <h1 style={{ fontSize: "var(--text-3xl)", fontWeight: 800 }}>
            Fitness Goals & <span className="text-gradient">Milestones</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", marginTop: "4px" }}>
            Track personal records, strength targets, and physiological milestones with live completion rings.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary btn-md"
        >
          <Plus className="w-4 h-4" />
          <span>Set New Goal</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="goals-stats-row">
        <div className="goals-stat-card">
          <div className="goals-stat-icon" style={{ background: "rgba(124, 58, 237, 0.15)", color: "#a78bfa" }}>
            <Target className="w-5 h-5" />
          </div>
          <div className="goals-stat-info">
            <h4>{totalGoals}</h4>
            <p>Total Goals</p>
          </div>
        </div>

        <div className="goals-stat-card">
          <div className="goals-stat-icon" style={{ background: "rgba(59, 130, 246, 0.15)", color: "#60a5fa" }}>
            <Clock className="w-5 h-5" />
          </div>
          <div className="goals-stat-info">
            <h4>{inProgressGoals}</h4>
            <p>In Progress</p>
          </div>
        </div>

        <div className="goals-stat-card">
          <div className="goals-stat-icon" style={{ background: "rgba(16, 185, 129, 0.15)", color: "var(--color-emerald)" }}>
            <Trophy className="w-5 h-5" />
          </div>
          <div className="goals-stat-info">
            <h4>{achievedGoals}</h4>
            <p>Milestones Hit</p>
          </div>
        </div>

        <div className="goals-stat-card">
          <div className="goals-stat-icon" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24" }}>
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="goals-stat-info">
            <h4>{avgCompletion}%</h4>
            <p>Avg Completion</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="goals-toolbar">
        <div className="goals-tab-group">
          <button
            type="button"
            className={`goals-filter-btn ${filter === "ALL" ? "active" : ""}`}
            onClick={() => setFilter("ALL")}
          >
            All Goals ({totalGoals})
          </button>
          <button
            type="button"
            className={`goals-filter-btn ${filter === "IN_PROGRESS" ? "active" : ""}`}
            onClick={() => setFilter("IN_PROGRESS")}
          >
            Active ({inProgressGoals})
          </button>
          <button
            type="button"
            className={`goals-filter-btn ${filter === "ACHIEVED" ? "active" : ""}`}
            onClick={() => setFilter("ACHIEVED")}
          >
            Achieved ({achievedGoals})
          </button>
        </div>

        <button
          type="button"
          onClick={fetchGoals}
          className="btn btn-ghost btn-sm"
          style={{ color: "var(--text-muted)" }}
          title="Refresh goals"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync Data</span>
        </button>
      </div>

      {/* Goals Grid */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "var(--space-6)" }}>
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="skeleton"
              style={{ height: "240px", borderRadius: "var(--radius-2xl)" }}
            />
          ))}
        </div>
      ) : filteredGoals.length === 0 ? (
        <div className="goals-empty-state">
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "rgba(124, 58, 237, 0.15)",
              color: "#a78bfa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto var(--space-4)",
            }}
          >
            <Target className="w-7 h-7" />
          </div>
          <h3 style={{ fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-2)" }}>
            {filter === "ACHIEVED"
              ? "No achieved milestones yet"
              : filter === "IN_PROGRESS"
              ? "No active goals in progress"
              : "No fitness goals created yet"}
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", maxWidth: "440px", margin: "0 auto var(--space-6)" }}>
            Set a measurable target like bench pressing 100 kg, running 5 km, or hitting 15% body fat to ignite your discipline.
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary btn-md"
          >
            <Plus className="w-4 h-4" />
            <span>Create Your First Goal</span>
          </button>
        </div>
      ) : (
        <div className="goals-grid">
          {filteredGoals.map((goal) => {
            const pct = Math.min(100, Math.round((goal.current / (goal.target || 1)) * 100));
            const isAchieved = goal.status === "ACHIEVED";

            // SVG ring calculations
            const radius = 28;
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset = circumference - (pct / 100) * circumference;

            const ringColor = isAchieved
              ? "var(--color-emerald)"
              : pct >= 70
              ? "#a78bfa"
              : pct >= 40
              ? "#60a5fa"
              : "#fbbf24";

            return (
              <div key={goal.id} className={`goal-card ${isAchieved ? "achieved" : ""}`}>
                <div>
                  <div className="goal-card-top">
                    <span
                      className={`goal-type-badge goal-type-${goal.type.toLowerCase().replace(/\s+/g, "_")}`}
                    >
                      {goal.type.replace(/_/g, " ")}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleToggleStatus(goal.id, goal.status)}
                      className={`badge ${isAchieved ? "badge-emerald" : "badge-gray"}`}
                      style={{ cursor: "pointer", border: "none" }}
                      title="Click to toggle status"
                    >
                      {isAchieved ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Achieved</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3" />
                          <span>In Progress</span>
                        </>
                      )}
                    </button>
                  </div>

                  <h3 className="goal-title">{goal.title}</h3>

                  {/* SVG Completion Ring & Visual Numbers */}
                  <div className="goal-visual-wrap">
                    <div className="goal-svg-ring">
                      <svg width="72" height="72">
                        <circle
                          className="goal-ring-bg"
                          strokeWidth="6"
                          fill="transparent"
                          r={radius}
                          cx="36"
                          cy="36"
                        />
                        <circle
                          className="goal-ring-bar"
                          stroke={ringColor}
                          strokeWidth="6"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          fill="transparent"
                          r={radius}
                          cx="36"
                          cy="36"
                        />
                      </svg>
                      <span className="goal-ring-center-text">{pct}%</span>
                    </div>

                    <div className="goal-progress-numbers">
                      <div className="goal-current-val">
                        {goal.current} <span style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", fontWeight: 500 }}>{goal.unit}</span>
                      </div>
                      <div className="goal-target-val">
                        Target: {goal.target} {goal.unit}
                      </div>
                      {goal.deadline && (
                        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "4px" }}>
                          Target Date: {new Date(goal.deadline).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Step Buttons & Delete Action */}
                <div className="goal-quick-controls">
                  <div className="goal-step-btn-group">
                    <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginRight: "4px" }}>Quick Log:</span>
                    <button
                      type="button"
                      className="goal-step-btn"
                      onClick={() => handleUpdateProgress(goal.id, -1)}
                      title="Decrease by 1"
                    >
                      -1
                    </button>
                    <button
                      type="button"
                      className="goal-step-btn"
                      onClick={() => handleUpdateProgress(goal.id, 1)}
                      title="Increase by 1"
                    >
                      +1
                    </button>
                    <button
                      type="button"
                      className="goal-step-btn"
                      onClick={() => handleUpdateProgress(goal.id, 5)}
                      title="Increase by 5"
                    >
                      +5
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="goal-action-dropdown-btn"
                    title="Delete Goal"
                  >
                    <Trash2 className="w-4 h-4 text-muted" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Goal Modal */}
      {isModalOpen && (
        <div className="goals-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="goals-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="goals-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                <Target className="w-5 h-5 text-violet" />
                <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 700 }}>Set a Fitness Goal</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="btn btn-ghost btn-sm"
                style={{ padding: "4px" }}
              >
                <X className="w-5 h-5 text-muted" />
              </button>
            </div>

            {errorMsg && (
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
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateGoal}>
              <div className="goals-form-group">
                <label>Goal Description / Title</label>
                <input
                  type="text"
                  placeholder="e.g. 100 kg Barbell Bench Press"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="goals-form-input"
                  required
                />
              </div>

              <div className="goals-form-row">
                <div className="goals-form-group">
                  <label>Category</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="goals-form-select"
                  >
                    <option value="STRENGTH">Strength</option>
                    <option value="WEIGHT_LOSS">Weight Loss</option>
                    <option value="ENDURANCE">Endurance</option>
                    <option value="MUSCLE_GAIN">Hypertrophy</option>
                    <option value="GENERAL">General Fitness</option>
                  </select>
                </div>

                <div className="goals-form-group">
                  <label>Measurement Unit</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="goals-form-select"
                  >
                    <option value="kg">Kilograms (kg)</option>
                    <option value="reps">Reps</option>
                    <option value="mins">Minutes</option>
                    <option value="%">Percent (%)</option>
                    <option value="km">Kilometers (km)</option>
                    <option value="cm">Centimeters (cm)</option>
                  </select>
                </div>
              </div>

              <div className="goals-form-row">
                <div className="goals-form-group">
                  <label>Current Value</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 70"
                    value={formData.current}
                    onChange={(e) => setFormData({ ...formData, current: e.target.value })}
                    className="goals-form-input"
                  />
                </div>

                <div className="goals-form-group">
                  <label>Target Value</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 100"
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                    className="goals-form-input"
                    required
                  />
                </div>
              </div>

              <div className="goals-form-group">
                <label>Target Completion Date (Optional)</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="goals-form-input"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)", marginTop: "var(--space-6)" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary btn-md"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-md"
                  disabled={submitting}
                >
                  {submitting ? "Saving Target..." : "Create Goal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
