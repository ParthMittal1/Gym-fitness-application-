"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  CreditCard,
  Target,
  LineChart,
  Dumbbell,
  Home,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  User,
} from "lucide-react";

const NAV_ITEMS = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: "Membership Pass",
    href: "/dashboard/membership",
    icon: CreditCard,
    badge: "PASS",
  },
  {
    name: "Fitness Goals",
    href: "/dashboard/goals",
    icon: Target,
    badge: null,
  },
  {
    name: "Progress Tracking",
    href: "/dashboard/progress",
    icon: LineChart,
    badge: null,
  },
  {
    name: "Workout Logger",
    href: "/dashboard/workouts",
    icon: Dumbbell,
    badge: null,
  },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const userInitial = session?.user?.name ? session.user.name[0].toUpperCase() : "A";

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* ── Desktop Sticky Sidebar ─────────────────────────────────────────── */}
      <aside className="dashboard-sidebar">
        <div>
          {/* Logo */}
          <div className="dashboard-sidebar-header">
            <Link href="/" className="dashboard-sidebar-logo">
              <div className="nav-logo-badge">
                <Dumbbell className="w-5 h-5 text-emerald" />
              </div>
              <div>
                <span className="nav-logo-text">
                  GYM<span className="text-gradient">.FITNESS</span>
                </span>
                <span style={{ display: "block", fontSize: "0.6rem", letterSpacing: "0.15em", color: "var(--text-muted)", fontWeight: 700 }}>
                  ATHLETE WORKSPACE
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="dashboard-sidebar-menu">
            <span className="dashboard-menu-category">MAIN MENU</span>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`dashboard-nav-item ${isActive ? "active" : ""}`}
                >
                  <div className="dashboard-nav-inner">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="badge badge-emerald" style={{ fontSize: "0.6rem", padding: "1px 6px" }}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <span className="dashboard-menu-category" style={{ marginTop: "var(--space-4)" }}>
              EXPLORE
            </span>
            <Link href="/" className="dashboard-nav-item">
              <div className="dashboard-nav-inner">
                <Home className="w-4 h-4" />
                <span>Public Website</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-muted" />
            </Link>
          </nav>
        </div>

        {/* User Card & Sign Out */}
        <div className="dashboard-sidebar-user">
          <div className="dashboard-user-card">
            <div className="dashboard-user-avatar">{userInitial}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="truncate" style={{ fontWeight: 700, fontSize: "var(--text-sm)" }}>
                {session?.user?.name || "Member Athlete"}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span className="badge badge-violet" style={{ fontSize: "0.6rem", padding: "1px 6px" }}>
                  {session?.user?.role || "MEMBER"}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="btn btn-ghost btn-sm btn-full"
            style={{ justifyContent: "center", gap: "6px" }}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Mobile Topbar with Hamburger Toggle ────────────────────────────── */}
      <div className="dashboard-topbar-mobile-btn">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="btn btn-ghost btn-sm"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* ── Mobile Drawer ──────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="dashboard-mobile-drawer animate-fade-in">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-8)" }}>
            <Link href="/" className="dashboard-sidebar-logo" onClick={closeMobile}>
              <div className="nav-logo-badge">
                <Dumbbell className="w-5 h-5 text-emerald" />
              </div>
              <span className="nav-logo-text">
                GYM<span className="text-gradient">.FITNESS</span>
              </span>
            </Link>
            <button
              type="button"
              onClick={closeMobile}
              style={{ background: "transparent", border: "none", color: "var(--text-primary)", cursor: "pointer", padding: "8px" }}
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", flexGrow: 1 }}>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobile}
                  className={`dashboard-nav-item ${isActive ? "active" : ""}`}
                  style={{ padding: "12px 16px" }}
                >
                  <div className="dashboard-nav-inner">
                    <Icon className="w-5 h-5" />
                    <span style={{ fontSize: "var(--text-base)" }}>{item.name}</span>
                  </div>
                </Link>
              );
            })}

            <div style={{ height: "1px", background: "var(--border-subtle)", marginBlock: "var(--space-4)" }} />

            <Link href="/" onClick={closeMobile} className="dashboard-nav-item">
              <div className="dashboard-nav-inner">
                <Home className="w-5 h-5" />
                <span>Back to Website</span>
              </div>
            </Link>
          </nav>

          <div style={{ paddingTop: "var(--space-6)", borderTop: "1px solid var(--border-subtle)" }}>
            <button
              type="button"
              onClick={() => {
                closeMobile();
                signOut({ callbackUrl: "/" });
              }}
              className="btn btn-ghost btn-full"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
