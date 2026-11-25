import type { Metadata } from "next";
import Link from "next/link";
import {
  Dumbbell,
  ShieldCheck,
  Star,
  MapPin,
  Users,
  Award,
  ArrowLeft,
  Flame,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Authentication | GYM Fitness",
  description: "Sign in or create an account with GYM Fitness - Train Smarter, Live Stronger.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-layout">
      {/* ── Left Side: Premium Gym Branding ─────────────────────────────────── */}
      <aside className="auth-branding">
        {/* Glow Effects Behind Branding */}
        <div className="auth-glow-top" />
        <div className="auth-glow-bottom" />

        {/* Brand Header */}
        <div className="auth-brand-header">
          <Link href="/" className="auth-brand-logo">
            <div className="auth-logo-badge">
              <Dumbbell className="w-6 h-6 text-emerald" />
            </div>
            <div>
              <span className="auth-brand-name">
                GYM<span className="text-gradient">.FITNESS</span>
              </span>
              <span className="auth-brand-sub">ALL-INDIA FRANCHISE</span>
            </div>
          </Link>
          <div className="badge badge-emerald auth-badge-pill">
            <Flame className="w-3.5 h-3.5" />
            <span>ELITE PERFORMANCE</span>
          </div>
        </div>

        {/* Center: Abstract Graphic & Heroic Statement */}
        <div className="auth-brand-center">
          <div className="auth-art-container">
            {/* Abstract Geometric Neon Fitness Art */}
            <svg
              className="auth-art-svg"
              viewBox="0 0 400 240"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="gymViolet" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#b89eff" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="gymEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#34d399" stopOpacity="0.2" />
                </linearGradient>
                <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Hexagonal Rings & Pulse Rings */}
              <circle cx="200" cy="120" r="90" stroke="rgba(124, 58, 237, 0.25)" strokeWidth="1.5" strokeDasharray="6 6" />
              <circle cx="200" cy="120" r="65" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="2" />
              <circle cx="200" cy="120" r="40" stroke="url(#gymViolet)" strokeWidth="3" filter="url(#neonGlow)" />

              {/* Dynamic Energy Lines */}
              <path d="M 40 180 Q 200 60 360 180" stroke="url(#gymEmerald)" strokeWidth="2.5" fill="none" opacity="0.6" />
              <path d="M 70 80 Q 200 210 330 80" stroke="url(#gymViolet)" strokeWidth="2" fill="none" opacity="0.5" />

              {/* Dumbbell Silhouette Center */}
              <rect x="188" y="116" width="24" height="8" rx="4" fill="#f0f0ff" />
              <rect x="180" y="104" width="8" height="32" rx="3" fill="#10b981" filter="url(#neonGlow)" />
              <rect x="174" y="108" width="6" height="24" rx="2" fill="#7c3aed" />
              <rect x="212" y="104" width="8" height="32" rx="3" fill="#10b981" filter="url(#neonGlow)" />
              <rect x="220" y="108" width="6" height="24" rx="2" fill="#7c3aed" />
            </svg>
          </div>

          <blockquote className="auth-quote-card card-glass">
            <p className="auth-quote-text">
              &ldquo;The clock is ticking. Are you becoming the person you want to be?
              Every workout counts. Every rep matters.&rdquo;
            </p>
            <footer className="auth-quote-footer">
              <div className="auth-quote-avatar">
                <Award className="w-4 h-4 text-emerald" />
              </div>
              <div>
                <cite className="auth-quote-author">Marcus Vance</cite>
                <div className="auth-quote-role">Head of Strength & Conditioning</div>
              </div>
            </footer>
          </blockquote>
        </div>

        {/* Bottom: Franchise Key Statistics */}
        <div className="auth-brand-bottom">
          <div className="auth-stats-grid">
            <div className="auth-stat-box">
              <div className="auth-stat-head">
                <MapPin className="w-4 h-4 text-emerald" />
                <span className="auth-stat-num">25+</span>
              </div>
              <span className="auth-stat-title">Nationwide Hubs</span>
            </div>

            <div className="auth-stat-box">
              <div className="auth-stat-head">
                <Users className="w-4 h-4 text-violet" />
                <span className="auth-stat-num">50K+</span>
              </div>
              <span className="auth-stat-title">Active Athletes</span>
            </div>

            <div className="auth-stat-box">
              <div className="auth-stat-head">
                <Star className="w-4 h-4 text-amber" />
                <span className="auth-stat-num">4.9★</span>
              </div>
              <span className="auth-stat-title">Google Rating</span>
            </div>
          </div>

          <div className="auth-security-note">
            <ShieldCheck className="w-4 h-4 text-emerald" />
            <span>Secure 256-Bit Authentication · Powered by NextAuth & Prisma</span>
          </div>
        </div>
      </aside>

      {/* ── Right Side: Form Viewport ────────────────────────────────────────── */}
      <main className="auth-form-container">
        {/* Mobile / Small-Screen Brand Pill & Back Link */}
        <div className="auth-top-nav">
          <Link href="/" className="auth-back-link">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <div className="hide-desktop">
            <Link href="/" className="auth-brand-logo-mobile">
              <Dumbbell className="w-5 h-5 text-emerald" />
              <span>GYM.FITNESS</span>
            </Link>
          </div>
        </div>

        {/* Actual Form Rendered Here */}
        <div className="auth-form-inner animate-scale-in">
          {children}
        </div>
      </main>
    </div>
  );
}
