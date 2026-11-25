"use client";

import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  LineChart as ChartIcon,
  Plus,
  Scale,
  Percent,
  TrendingDown,
  TrendingUp,
  Sparkles,
  Calendar,
  Trash2,
  X,
  AlertCircle,
  CheckCircle2,
  Activity,
  Ruler,
} from "lucide-react";
import "./progress.css";

interface ProgressEntryItem {
  id: string;
  weight: number | null;
  bodyFat: number | null;
  chest: number | null;
  waist: number | null;
  hips: number | null;
  biceps: number | null;
  thighs: number | null;
  notes: string | null;
  date: string;
}

interface ProgressTrackerClientProps {
  initialEntries: ProgressEntryItem[];
}

export function ProgressTrackerClient({
  initialEntries,
}: ProgressTrackerClientProps) {
  const [entries, setEntries] = useState<ProgressEntryItem[]>(initialEntries);
  const [activeMetric, setActiveMetric] = useState<"weight" | "bodyFat">("weight");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    weight: "",
    bodyFat: "",
    chest: "",
    waist: "",
    hips: "",
    biceps: "",
    thighs: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.weight && !formData.bodyFat) {
      setErrorMsg("Please provide at least Weight or Body Fat %.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg(null);

      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weight: formData.weight ? parseFloat(formData.weight) : null,
          bodyFat: formData.bodyFat ? parseFloat(formData.bodyFat) : null,
          chest: formData.chest ? parseFloat(formData.chest) : null,
          waist: formData.waist ? parseFloat(formData.waist) : null,
          hips: formData.hips ? parseFloat(formData.hips) : null,
          biceps: formData.biceps ? parseFloat(formData.biceps) : null,
          thighs: formData.thighs ? parseFloat(formData.thighs) : null,
          notes: formData.notes,
          date: new Date(formData.date).toISOString(),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to record entry");
      }

      const data = await res.json();
      setEntries((prev) =>
        [...prev, data.entry].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )
      );

      setIsModalOpen(false);
      setFormData({
        weight: "",
        bodyFat: "",
        chest: "",
        waist: "",
        hips: "",
        biceps: "",
        thighs: "",
        notes: "",
        date: new Date().toISOString().split("T")[0],
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Failed to record progress entry");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this progress log?")) return;

    setEntries((prev) => prev.filter((e) => e.id !== id));

    try {
      await fetch(`/api/progress?id=${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Failed to delete progress entry:", err);
    }
  };

  // Seed sample demo data if empty
  const handleSeedDemoData = async () => {
    const demoRecords = [
      { weight: 82.5, bodyFat: 21.0, chest: 102, waist: 88, biceps: 34, notes: "Baseline check-in", date: new Date(Date.now() - 75 * 86400000).toISOString() },
      { weight: 81.2, bodyFat: 20.1, chest: 102, waist: 86, biceps: 34.5, notes: "Week 3 cut", date: new Date(Date.now() - 55 * 86400000).toISOString() },
      { weight: 79.8, bodyFat: 18.9, chest: 103, waist: 84, biceps: 35, notes: "Mid-phase progress", date: new Date(Date.now() - 35 * 86400000).toISOString() },
      { weight: 78.4, bodyFat: 17.5, chest: 103.5, waist: 82, biceps: 35.5, notes: "Strict macros adhered", date: new Date(Date.now() - 15 * 86400000).toISOString() },
      { weight: 77.2, bodyFat: 16.2, chest: 104, waist: 80.5, biceps: 36, notes: "Peak conditioning", date: new Date().toISOString() },
    ];

    try {
      setSubmitting(true);
      for (const rec of demoRecords) {
        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rec),
        });
      }
      const ref = await fetch("/api/progress");
      if (ref.ok) {
        const d = await ref.json();
        setEntries(d.entries || []);
      }
    } catch (err) {
      console.error("Failed to seed demo data:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Metric summaries
  const validWeights = entries.filter((e) => e.weight !== null && e.weight !== undefined);
  const validBf = entries.filter((e) => e.bodyFat !== null && e.bodyFat !== undefined);

  const currentWeight = validWeights.length > 0 ? validWeights[validWeights.length - 1].weight : null;
  const initialWeight = validWeights.length > 0 ? validWeights[0].weight : null;
  const netWeightDiff =
    currentWeight !== null && initialWeight !== null
      ? parseFloat((currentWeight - initialWeight).toFixed(1))
      : 0;

  const currentBf = validBf.length > 0 ? validBf[validBf.length - 1].bodyFat : null;
  const initialBf = validBf.length > 0 ? validBf[0].bodyFat : null;
  const netBfDiff =
    currentBf !== null && initialBf !== null
      ? parseFloat((currentBf - initialBf).toFixed(1))
      : 0;

  const latestEntry = entries.length > 0 ? entries[entries.length - 1] : null;

  // Chart dataset
  const chartData = entries.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    }),
    fullDate: new Date(entry.date).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    weight: entry.weight,
    bodyFat: entry.bodyFat,
    chest: entry.chest,
    waist: entry.waist,
    biceps: entry.biceps,
  }));

  // Min and max for domain auto-scaling
  const currentMetricValues = entries
    .map((e) => (activeMetric === "weight" ? e.weight : e.bodyFat))
    .filter((v): v is number => v !== null && v !== undefined);

  const minVal = currentMetricValues.length > 0 ? Math.floor(Math.min(...currentMetricValues) - 2) : 0;
  const maxVal = currentMetricValues.length > 0 ? Math.ceil(Math.max(...currentMetricValues) + 2) : 100;

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
      {/* Page Header */}
      <div className="progress-header">
        <div>
          <div className="badge badge-emerald" style={{ marginBottom: "var(--space-2)" }}>
            <Activity className="w-3.5 h-3.5" />
            <span>BIO-ANALYTICS</span>
          </div>
          <h1 style={{ fontSize: "var(--text-3xl)", fontWeight: 800 }}>
            Physique & <span className="text-gradient">Progress Tracking</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", marginTop: "4px" }}>
            Monitor body composition trends, body fat percentages, and circumference measurements over time.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary btn-md"
        >
          <Plus className="w-4 h-4" />
          <span>Log Measurements</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="progress-stats-grid">
        <div className="progress-stat-card">
          <div className="progress-stat-icon" style={{ background: "rgba(16, 185, 129, 0.15)", color: "var(--color-emerald)" }}>
            <Scale className="w-5 h-5" />
          </div>
          <div className="progress-stat-content">
            <h4>{currentWeight ? `${currentWeight} kg` : "—"}</h4>
            <p>Current Weight</p>
          </div>
        </div>

        <div className="progress-stat-card">
          <div
            className="progress-stat-icon"
            style={{
              background: netWeightDiff <= 0 ? "rgba(16, 185, 129, 0.15)" : "rgba(124, 58, 237, 0.15)",
              color: netWeightDiff <= 0 ? "var(--color-emerald)" : "#a78bfa",
            }}
          >
            {netWeightDiff <= 0 ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
          </div>
          <div className="progress-stat-content">
            <h4 style={{ color: netWeightDiff <= 0 ? "var(--color-emerald)" : "#a78bfa" }}>
              {netWeightDiff > 0 ? `+${netWeightDiff}` : netWeightDiff} kg
            </h4>
            <p>Net Weight Delta</p>
          </div>
        </div>

        <div className="progress-stat-card">
          <div className="progress-stat-icon" style={{ background: "rgba(124, 58, 237, 0.15)", color: "#a78bfa" }}>
            <Percent className="w-5 h-5" />
          </div>
          <div className="progress-stat-content">
            <h4>{currentBf ? `${currentBf}%` : "—"}</h4>
            <p>Body Fat %</p>
          </div>
        </div>

        <div className="progress-stat-card">
          <div className="progress-stat-icon" style={{ background: "rgba(59, 130, 246, 0.15)", color: "#60a5fa" }}>
            <Ruler className="w-5 h-5" />
          </div>
          <div className="progress-stat-content">
            <h4>{latestEntry?.waist ? `${latestEntry.waist} cm` : "—"}</h4>
            <p>Waistline</p>
          </div>
        </div>
      </div>

      {/* Interactive Chart Card */}
      <div className="progress-chart-card">
        <div className="progress-chart-header">
          <div>
            <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 700, display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <ChartIcon className="w-5 h-5 text-emerald" />
              <span>
                {activeMetric === "weight" ? "Weight Progression (kg)" : "Body Fat Trend (%)"}
              </span>
            </h3>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
              Continuous curve showing physiological adaptation over time
            </span>
          </div>

          <div className="chart-tab-group">
            <button
              type="button"
              className={`chart-tab-btn ${activeMetric === "weight" ? "active" : ""}`}
              onClick={() => setActiveMetric("weight")}
            >
              Weight (kg)
            </button>
            <button
              type="button"
              className={`chart-tab-btn ${activeMetric === "bodyFat" ? "active violet" : ""}`}
              onClick={() => setActiveMetric("bodyFat")}
            >
              Body Fat (%)
            </button>
          </div>
        </div>

        {/* Recharts Area / Line Chart */}
        {entries.length === 0 ? (
          <div
            style={{
              height: "280px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: "var(--space-3)",
            }}
          >
            <ChartIcon className="w-8 h-8 text-muted" />
            <h4 style={{ fontWeight: 700, color: "var(--text-primary)" }}>No measurements recorded yet</h4>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", maxWidth: "380px" }}>
              Start recording your morning weight or body fat to unlock analytical trajectory graphs.
            </p>
            <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-2)" }}>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="btn btn-primary btn-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Weigh-In</span>
              </button>
              <button
                type="button"
                onClick={handleSeedDemoData}
                className="btn btn-secondary btn-sm"
                disabled={submitting}
              >
                <Sparkles className="w-3.5 h-3.5 text-violet" />
                <span>Load Sample Data</span>
              </button>
            </div>
          </div>
        ) : mounted ? (
          <div className="progress-chart-viewport">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="violetGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" />
                <XAxis
                  dataKey="date"
                  stroke="var(--text-muted)"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="var(--text-muted)"
                  fontSize={11}
                  domain={[minVal, maxVal]}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div
                          style={{
                            background: "rgba(18, 18, 26, 0.95)",
                            border: "1px solid var(--border-subtle)",
                            borderRadius: "var(--radius-lg)",
                            padding: "10px 14px",
                            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
                          }}
                        >
                          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>
                            {data.fullDate}
                          </div>
                          {data.weight !== null && (
                            <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-emerald)" }}>
                              Weight: {data.weight} kg
                            </div>
                          )}
                          {data.bodyFat !== null && (
                            <div style={{ fontSize: "13px", fontWeight: 700, color: "#a78bfa" }}>
                              Body Fat: {data.bodyFat}%
                            </div>
                          )}
                          {data.waist !== null && (
                            <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>
                              Waist: {data.waist} cm
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={activeMetric}
                  stroke={activeMetric === "weight" ? "#10b981" : "#7c3aed"}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill={`url(#${activeMetric === "weight" ? "emeraldGradient" : "violetGradient"})`}
                  dot={{ r: 4, fill: activeMetric === "weight" ? "#10b981" : "#7c3aed" }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="skeleton" style={{ height: "340px", borderRadius: "var(--radius-xl)" }} />
        )}
      </div>

      {/* Historical Entries Table */}
      <div className="progress-table-card">
        <div className="progress-table-header">
          <h3 style={{ fontSize: "var(--text-xl)", fontWeight: 700 }}>
            Measurement Log History ({entries.length})
          </h3>
          {entries.length > 0 && (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="btn btn-secondary btn-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Entry</span>
            </button>
          )}
        </div>

        {entries.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", textAlign: "center", padding: "var(--space-6)" }}>
            No log history available.
          </p>
        ) : (
          <div className="progress-table-wrapper">
            <table className="progress-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Weight (kg)</th>
                  <th>Body Fat %</th>
                  <th>Chest (cm)</th>
                  <th>Waist (cm)</th>
                  <th>Biceps (cm)</th>
                  <th>Notes</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries
                  .slice()
                  .reverse()
                  .map((entry) => (
                    <tr key={entry.id}>
                      <td style={{ fontWeight: 600 }}>
                        {new Date(entry.date).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td>
                        {entry.weight ? (
                          <span style={{ fontWeight: 700, color: "var(--color-emerald)" }}>
                            {entry.weight} kg
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>
                        {entry.bodyFat ? (
                          <span style={{ fontWeight: 700, color: "#a78bfa" }}>
                            {entry.bodyFat}%
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>{entry.chest ? `${entry.chest} cm` : "—"}</td>
                      <td>{entry.waist ? `${entry.waist} cm` : "—"}</td>
                      <td>{entry.biceps ? `${entry.biceps} cm` : "—"}</td>
                      <td style={{ color: "var(--text-secondary)", fontSize: "var(--text-xs)" }}>
                        {entry.notes || "—"}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          type="button"
                          onClick={() => handleDelete(entry.id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--text-muted)",
                            cursor: "pointer",
                            padding: "4px",
                          }}
                          title="Delete entry"
                        >
                          <Trash2 className="w-4 h-4 hover:text-red-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Measurements Modal */}
      {isModalOpen && (
        <div className="progress-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="progress-modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-4)", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "var(--space-3)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                <Scale className="w-5 h-5 text-emerald" />
                <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 700 }}>Log Body Metrics</h3>
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

            <form onSubmit={handleCreateEntry}>
              <div className="progress-form-row">
                <div className="progress-form-group">
                  <label>Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 78.5"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="progress-input"
                  />
                </div>

                <div className="progress-form-group">
                  <label>Body Fat (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 17.5"
                    value={formData.bodyFat}
                    onChange={(e) => setFormData({ ...formData, bodyFat: e.target.value })}
                    className="progress-input"
                  />
                </div>
              </div>

              <div className="progress-form-row-3">
                <div className="progress-form-group">
                  <label>Chest (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="104"
                    value={formData.chest}
                    onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
                    className="progress-input"
                  />
                </div>

                <div className="progress-form-group">
                  <label>Waist (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="82"
                    value={formData.waist}
                    onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                    className="progress-input"
                  />
                </div>

                <div className="progress-form-group">
                  <label>Biceps (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="36"
                    value={formData.biceps}
                    onChange={(e) => setFormData({ ...formData, biceps: e.target.value })}
                    className="progress-input"
                  />
                </div>
              </div>

              <div className="progress-form-group">
                <label>Date of Weigh-In</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="progress-input"
                  required
                />
              </div>

              <div className="progress-form-group">
                <label>Notes / Condition</label>
                <input
                  type="text"
                  placeholder="Morning fasted weigh-in, feeling energetic"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="progress-input"
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
                  {submitting ? "Saving Entry..." : "Save Metrics"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
