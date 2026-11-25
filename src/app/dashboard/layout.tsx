import React from "react";
import type { Metadata } from "next";
import { SidebarNav } from "./SidebarNav";
import "./dashboard.css";
import Link from "next/link";
import { Dumbbell, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Athlete Dashboard | GYM Fitness",
  description: "Manage your gym membership, workout logs, goals, and physical progress.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-layout-wrapper">
      {/* ── 1. Shared Sidebar Navigation ──────────────────────────────────── */}
      <SidebarNav />

      {/* ── 2. Main Dashboard Work Area ────────────────────────────────────── */}
      <div className="dashboard-main-area">
        {/* Topbar Banner */}
        <header className="dashboard-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <div className="nav-logo-badge" style={{ width: "32px", height: "32px" }}>
              <Dumbbell className="w-4 h-4 text-emerald" />
            </div>
            <span style={{ fontSize: "var(--text-sm)", fontWeight: 700, letterSpacing: "0.04em" }}>
              WORKSPACE <span className="text-gradient">PORTAL</span>
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
            <div className="badge badge-emerald hide-mobile">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ACTIVE SESSION</span>
            </div>
          </div>
        </header>

        {/* Child Page Viewport */}
        <div className="dashboard-content">
          {children}
        </div>
      </div>
    </div>
  );
}
