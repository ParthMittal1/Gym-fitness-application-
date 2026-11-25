"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Flame,
  ArrowRight,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Users,
  Award,
  Zap,
} from "lucide-react";

interface Particle {
  id: number;
  top: number;
  left: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
}

export function HeroSection() {
  // CRITICAL: Prevent hydration mismatch by deferring dynamic particles until mounted
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setMounted(true);

    // Generate deterministic/client-only particles safely after DOM mount
    const generated: Particle[] = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      top: Math.floor((i * 19) % 90) + 5,
      left: Math.floor((i * 23) % 94) + 3,
      size: (i % 3) * 6 + 4,
      opacity: ((i % 4) + 2) * 0.1,
      delay: (i % 5) * 0.4,
      duration: 3 + (i % 4),
    }));

    setParticles(generated);
  }, []);

  return (
    <section className="hero-wrapper">
      {/* Background Glow Spheres */}
      <div className="hero-glow-1" />
      <div className="hero-glow-2" />

      {/* Decorative Particles (Client-rendered only to avoid hydration mismatches) */}
      {mounted &&
        particles.map((p) => (
          <div
            key={p.id}
            className="hero-particle animate-float"
            style={{
              top: `${p.top}%`,
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}

      <div className="container" style={{ position: "relative", zIndex: 10 }}>
        <div className="hero-inner">
          {/* Top Badge */}
          <div className="hero-badge-pill animate-fade-down">
            <Flame className="w-3.5 h-3.5 text-emerald" />
            <span>INDIA&apos;S PREMIER FITNESS FRANCHISE • 25+ HUBS</span>
          </div>

          {/* Big Display Heading */}
          <h1 className="hero-headline animate-fade-up">
            TRANSFORM YOUR BODY.
            <br />
            <span className="text-gradient">UNLEASH PEAK POWER.</span>
          </h1>

          {/* Subtext */}
          <p className="hero-subtext animate-fade-up delay-100">
            Train at India&apos;s most advanced athletic clubs with calibrated Olympic
            weights, custom Hammer Strength rigs, certified master trainers, and precision
            workout analytics across 25+ nationwide locations.
          </p>

          {/* CTA Buttons */}
          <div className="hero-buttons-row animate-fade-up delay-200">
            <Link href="/register" className="btn btn-primary btn-lg">
              <Zap className="w-4 h-4" />
              <span>Start 7-Day Free Pass</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="#plans" className="btn btn-ghost btn-lg">
              <span>View Membership Plans</span>
            </Link>
            <Link
              href="#locations"
              className="btn btn-secondary btn-lg"
              style={{ borderStyle: "dashed" }}
            >
              <MapPin className="w-4 h-4" />
              <span>Locate Nearest Gym</span>
            </Link>
          </div>

          {/* Franchise Stats Strip */}
          <div className="hero-stats-strip animate-fade-up delay-300">
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  marginBottom: "4px",
                }}
              >
                <Users className="w-4 h-4 text-violet" />
                <span className="stat-value" style={{ fontSize: "var(--text-3xl)" }}>
                  50,000+
                </span>
              </div>
              <div className="stat-label">Active Athletes</div>
            </div>

            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  marginBottom: "4px",
                }}
              >
                <MapPin className="w-4 h-4 text-emerald" />
                <span className="stat-value" style={{ fontSize: "var(--text-3xl)" }}>
                  25+
                </span>
              </div>
              <div className="stat-label">Prime Locations</div>
            </div>

            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  marginBottom: "4px",
                }}
              >
                <Award className="w-4 h-4 text-amber" />
                <span className="stat-value" style={{ fontSize: "var(--text-3xl)" }}>
                  4.9★
                </span>
              </div>
              <div className="stat-label">Community Rating</div>
            </div>

            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  marginBottom: "4px",
                }}
              >
                <ShieldCheck className="w-4 h-4 text-emerald" />
                <span className="stat-value" style={{ fontSize: "var(--text-3xl)" }}>
                  100%
                </span>
              </div>
              <div className="stat-label">Certified Coaches</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
