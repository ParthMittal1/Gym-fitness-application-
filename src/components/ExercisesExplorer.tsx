"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Dumbbell,
  Search,
  Filter,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Zap,
  ArrowRight,
  Flame,
  Info,
} from "lucide-react";

export interface ExerciseItem {
  id: string;
  name: string;
  slug: string;
  muscleGroup: string;
  equipment: string | null;
  difficulty: string;
  instructions: string | null;
  tips: string | null;
  videoUrl: string | null;
  imageUrl: string | null;
}

export function ExercisesExplorer({
  exercises,
}: {
  exercises: ExerciseItem[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("ALL");
  const [selectedEquipment, setSelectedEquipment] = useState("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState("ALL");
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);

  const muscleGroups = useMemo(() => {
    const list = Array.from(new Set(exercises.map((e) => e.muscleGroup))).sort();
    return ["ALL", ...list];
  }, [exercises]);

  const equipmentList = useMemo(() => {
    const set = new Set<string>();
    exercises.forEach((e) => {
      if (e.equipment) set.add(e.equipment);
    });
    return ["ALL", ...Array.from(set).sort()];
  }, [exercises]);

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const search = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !search ||
        ex.name.toLowerCase().includes(search) ||
        ex.muscleGroup.toLowerCase().includes(search) ||
        (ex.equipment && ex.equipment.toLowerCase().includes(search));

      const matchesMuscle =
        selectedMuscle === "ALL" || ex.muscleGroup === selectedMuscle;

      const matchesEquip =
        selectedEquipment === "ALL" || ex.equipment === selectedEquipment;

      const matchesDiff =
        selectedDifficulty === "ALL" || ex.difficulty === selectedDifficulty;

      return matchesSearch && matchesMuscle && matchesEquip && matchesDiff;
    });
  }, [exercises, searchTerm, selectedMuscle, selectedEquipment, selectedDifficulty]);

  return (
    <div>
      {/* ── Search & Filter Controls ────────────────────────────────────────── */}
      <div
        className="card"
        style={{
          padding: "var(--space-6)",
          marginBottom: "var(--space-10)",
          background: "rgba(18, 19, 32, 0.8)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          {/* Search Input */}
          <div className="input-wrapper">
            <Search className="input-icon w-4 h-4" />
            <input
              type="text"
              placeholder="Search exercises by name, muscle (e.g. Chest, Quads) or equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="auth-input"
              style={{ paddingLeft: "2.8rem" }}
            />
          </div>

          {/* Quick Filter Selectors */}
          <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Filter className="w-4 h-4 text-violet" />
              <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)" }}>
                Categories:
              </span>
            </div>

            {/* Muscle Group */}
            <div style={{ flex: 1, minWidth: "160px" }}>
              <select
                value={selectedMuscle}
                onChange={(e) => setSelectedMuscle(e.target.value)}
                className="input"
                style={{ padding: "0.55rem var(--space-3)", fontSize: "var(--text-xs)" }}
              >
                <option value="ALL">All Muscle Groups</option>
                {muscleGroups.filter((m) => m !== "ALL").map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Equipment */}
            <div style={{ flex: 1, minWidth: "160px" }}>
              <select
                value={selectedEquipment}
                onChange={(e) => setSelectedEquipment(e.target.value)}
                className="input"
                style={{ padding: "0.55rem var(--space-3)", fontSize: "var(--text-xs)" }}
              >
                <option value="ALL">All Equipment</option>
                {equipmentList.filter((eq) => eq !== "ALL").map((eq) => (
                  <option key={eq} value={eq}>
                    {eq}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div style={{ flex: 1, minWidth: "160px" }}>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="input"
                style={{ padding: "0.55rem var(--space-3)", fontSize: "var(--text-xs)" }}
              >
                <option value="ALL">All Difficulties</option>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>

            {(searchTerm || selectedMuscle !== "ALL" || selectedEquipment !== "ALL" || selectedDifficulty !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedMuscle("ALL");
                  setSelectedEquipment("ALL");
                  setSelectedDifficulty("ALL");
                }}
                className="btn btn-ghost btn-sm"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Results Count ──────────────────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-6)" }}>
        <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
          Showing <strong style={{ color: "#fff" }}>{filteredExercises.length}</strong> movements
        </span>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          {selectedMuscle !== "ALL" && (
            <span className="badge badge-emerald">{selectedMuscle}</span>
          )}
          {selectedDifficulty !== "ALL" && (
            <span className="badge badge-violet">{selectedDifficulty}</span>
          )}
        </div>
      </div>

      {/* ── Exercise Cards Grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-3" style={{ gap: "var(--space-6)" }}>
        {filteredExercises.map((ex) => {
          let tipsList: string[] = [];
          if (ex.tips) {
            try {
              tipsList = JSON.parse(ex.tips);
            } catch {
              tipsList = [];
            }
          }

          const isExpanded = expandedExerciseId === ex.id;

          return (
            <div
              key={ex.id}
              className="card"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "var(--space-6)",
              }}
            >
              <div>
                {/* Header Pills */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-3)" }}>
                  <span className="badge badge-emerald" style={{ fontSize: "0.68rem" }}>
                    {ex.muscleGroup}
                  </span>
                  <span
                    className={`badge ${
                      ex.difficulty === "ADVANCED"
                        ? "badge-rose"
                        : ex.difficulty === "INTERMEDIATE"
                        ? "badge-amber"
                        : "badge-muted"
                    }`}
                    style={{ fontSize: "0.65rem" }}
                  >
                    {ex.difficulty}
                  </span>
                </div>

                {/* Name */}
                <h3 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-2)" }}>
                  {ex.name}
                </h3>

                {/* Equipment */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "var(--text-xs)", color: "var(--text-muted)", marginBottom: "var(--space-4)" }}>
                  <Dumbbell className="w-3.5 h-3.5 text-violet" />
                  <span>Equipment: {ex.equipment || "Bodyweight / None"}</span>
                </div>

                {/* Instructions */}
                {ex.instructions && (
                  <div style={{ marginBottom: "var(--space-4)" }}>
                    <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "4px" }}>
                      FORM & EXECUTION
                    </div>
                    <p style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)", whiteSpace: "pre-line", lineHeight: 1.6 }}>
                      {isExpanded ? ex.instructions : `${ex.instructions.slice(0, 120)}...`}
                    </p>
                  </div>
                )}

                {/* Pro Tips List */}
                {tipsList.length > 0 && isExpanded && (
                  <div
                    style={{
                      padding: "var(--space-3)",
                      background: "rgba(124, 58, 237, 0.08)",
                      border: "1px solid rgba(124, 58, 237, 0.2)",
                      borderRadius: "var(--radius-md)",
                      marginBottom: "var(--space-4)",
                    }}
                  >
                    <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", color: "var(--color-violet-200)", marginBottom: "4px" }}>
                      PRO COACHING CUES
                    </div>
                    <ul style={{ paddingLeft: "16px", fontSize: "var(--text-xs)", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                      {tipsList.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "var(--space-2)", paddingTop: "var(--space-3)", borderTop: "1px solid var(--border-subtle)" }}>
                <button
                  type="button"
                  onClick={() => setExpandedExerciseId(isExpanded ? null : ex.id)}
                  className="btn btn-ghost btn-sm"
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  <span>{isExpanded ? "Show Less" : "Instructions"}</span>
                </button>
                <Link
                  href={`/dashboard/log?exerciseId=${ex.id}`}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  <span>Log Set</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
