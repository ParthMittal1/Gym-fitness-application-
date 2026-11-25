"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Dumbbell,
  Menu,
  X,
  User,
  ArrowRight,
  LogOut,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";

export function Navbar() {
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className={`navbar-sticky ${isScrolled ? "navbar-scrolled" : ""}`}>
      <div className="nav-container">
        {/* Brand Logo */}
        <Link href="/" className="nav-logo" onClick={closeMobileMenu}>
          <div className="nav-logo-badge">
            <Dumbbell className="w-5 h-5 text-emerald" />
          </div>
          <div>
            <span className="nav-logo-text">
              GYM<span className="text-gradient">.FITNESS</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-links-desktop">
          <Link href="#features" className="nav-link-item">
            Features
          </Link>
          <Link href="#plans" className="nav-link-item">
            Membership Plans
          </Link>
          <Link href="#locations" className="nav-link-item">
            Gym Locations
          </Link>
          <Link href="#community" className="nav-link-item">
            Athletes
          </Link>
        </nav>

        {/* Desktop Auth Actions */}
        <div className="nav-actions-desktop">
          {status === "loading" ? (
            <div
              className="skeleton"
              style={{ width: "120px", height: "36px", borderRadius: "var(--radius-md)" }}
            />
          ) : session?.user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  padding: "4px 12px",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-full)",
                  fontSize: "var(--text-xs)",
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "rgba(124, 58, 237, 0.2)",
                    border: "1px solid rgba(124, 58, 237, 0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <User className="w-3 h-3 text-violet" />
                </div>
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                  {session.user.name?.split(" ")[0] || "Athlete"}
                </span>
                <span className="badge badge-emerald" style={{ fontSize: "0.6rem", padding: "1px 6px" }}>
                  {session.user.role}
                </span>
              </div>

              <Link href="/dashboard" className="btn btn-primary btn-sm">
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>

              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="btn btn-ghost btn-sm"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm">
                Sign In
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Get Started</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          className="nav-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="nav-mobile-drawer animate-fade-down">
          <Link href="#features" className="nav-link-item" onClick={closeMobileMenu}>
            Features & Amenities
          </Link>
          <Link href="#plans" className="nav-link-item" onClick={closeMobileMenu}>
            Membership Plans
          </Link>
          <Link href="#locations" className="nav-link-item" onClick={closeMobileMenu}>
            Find a Gym (25+ Locations)
          </Link>
          <Link href="#community" className="nav-link-item" onClick={closeMobileMenu}>
            Community & Reviews
          </Link>

          <div
            style={{
              height: "1px",
              background: "var(--border-subtle)",
              marginBlock: "var(--space-2)",
            }}
          />

          {session?.user ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "var(--space-2) 0",
                }}
              >
                <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
                  Signed in as{" "}
                  <strong style={{ color: "var(--text-primary)" }}>
                    {session.user.name}
                  </strong>
                </span>
                <span className="badge badge-emerald">{session.user.role}</span>
              </div>
              <Link
                href="/dashboard"
                className="btn btn-primary btn-full"
                onClick={closeMobileMenu}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  signOut({ callbackUrl: "/" });
                }}
                className="btn btn-ghost btn-full"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <Link
                href="/login"
                className="btn btn-ghost btn-full"
                onClick={closeMobileMenu}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="btn btn-primary btn-full"
                onClick={closeMobileMenu}
              >
                <Sparkles className="w-4 h-4" />
                <span>Get Started</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
