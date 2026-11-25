import React, { Suspense } from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesGrid } from "@/components/FeaturesGrid";
import { PricingCards } from "@/components/PricingCards";
import { Footer } from "@/components/Footer";
import {
  Check,
  Star,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  Flame,
  Award,
  Zap,
  Loader2,
} from "lucide-react";

// ─── Dynamic Plans Section (Streamed via Suspense) ───────────────────────────
async function PlansSection() {
  const plans = await db.plan.findMany({
    where: { active: true },
    orderBy: { price: "asc" },
  });

  return <PricingCards plans={plans} />;
}

// ─── Dynamic Locations Section (Streamed via Suspense) ────────────────────────
async function LocationsSection() {
  const [locations, totalLocationsCount] = await Promise.all([
    db.gymLocation.findMany({
      where: { active: true },
      take: 8,
      orderBy: { rating: "desc" },
    }),
    db.gymLocation.count({
      where: { active: true },
    }),
  ]);

  return (
    <>
      <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto var(--space-16)" }}>
        <div className="badge badge-emerald" style={{ marginBottom: "var(--space-3)" }}>
          <MapPin className="w-3.5 h-3.5" />
          <span>NATIONWIDE FOOTPRINT</span>
        </div>
        <h2 style={{ marginBottom: "var(--space-4)" }}>
          {totalLocationsCount}+ Luxury Gyms Across{" "}
          <span className="text-gradient">Major Metros</span>
        </h2>
        <p style={{ fontSize: "var(--text-lg)" }}>
          Biometric entry, valet parking, and 24/7 operating hours available at select clubs.
        </p>
      </div>

      <div className="grid grid-cols-4">
        {locations.map((loc) => {
          let amenities: string[] = [];
          if (loc.amenities) {
            try {
              amenities = JSON.parse(loc.amenities);
            } catch {
              amenities = [];
            }
          }

          return (
            <div key={loc.id} className="location-card">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "var(--space-2)",
                }}
              >
                <span className="badge badge-emerald" style={{ fontSize: "0.68rem" }}>
                  {loc.city}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Star className="w-3.5 h-3.5 text-amber" style={{ fill: "currentColor" }} />
                  <span style={{ fontSize: "var(--text-xs)", fontWeight: 700 }}>
                    {loc.rating || "4.8"}
                  </span>
                </div>
              </div>

              <h3 style={{ fontSize: "var(--text-base)", marginBottom: "var(--space-2)" }}>
                {loc.name}
              </h3>

              <p
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--text-secondary)",
                  marginBottom: "var(--space-4)",
                  flexGrow: 1,
                }}
              >
                {loc.address}
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.72rem",
                  color: "var(--text-muted)",
                  marginBottom: "var(--space-3)",
                }}
              >
                <Clock className="w-3.5 h-3.5 text-violet" />
                <span>{loc.timings || "Mon-Sun 5am-11pm"}</span>
              </div>

              {amenities.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {amenities.slice(0, 3).map((a, i) => (
                    <span key={i} className="location-amenity-pill">
                      {a}
                    </span>
                  ))}
                  {amenities.length > 3 && (
                    <span className="location-amenity-pill">
                      +{amenities.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

// ─── Loading Skeletons ────────────────────────────────────────────────────────
function PlansLoadingSkeleton() {
  return (
    <div className="pricing-grid">
      {[1, 2, 3].map((n) => (
        <div key={n} className="pricing-card skeleton" style={{ minHeight: "440px" }} />
      ))}
    </div>
  );
}

function LocationsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-4">
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className="location-card skeleton" style={{ minHeight: "220px" }} />
      ))}
    </div>
  );
}

// ─── Static Athlete Stories ──────────────────────────────────────────────────
const testimonials = [
  {
    name: "Rohan Malhotra",
    role: "Powerlifter & Member at Bandra West",
    quote:
      "The calibrated Eleiko plates and competition benches are unmatched in Mumbai. Dropped 8% body fat in 4 months using their in-app workout tracker.",
    rating: 5,
    city: "Mumbai",
    metric: "-14kg Fat Lost",
  },
  {
    name: "Sneha Kulkarni",
    role: "Marathon Runner & Member at Indiranagar",
    quote:
      "Having the All-India OnePass is a game-changer. I travel weekly between Bengaluru and Delhi and never miss a workout or sauna recovery session.",
    rating: 5,
    city: "Bengaluru",
    metric: "Sub-4hr Marathon",
  },
  {
    name: "Vikram Singhania",
    role: "CrossFit Athlete & Member at Cyber City",
    quote:
      "The coaches genuinely care about progressive overload and biomechanics. The community energy during morning HIIT and boxing is electric.",
    rating: 5,
    city: "Gurugram",
    metric: "+45kg Deadlift PR",
  },
];

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* ── 1. Sticky Glassmorphism Navbar ─────────────────────────────────── */}
      <Navbar />

      {/* ── 2. Hero Section with Hydration-Safe Particles ──────────────────── */}
      <HeroSection />

      {/* ── 3. Features & Amenities Grid ────────────────────────────────────── */}
      <FeaturesGrid />

      {/* ── 4. Pricing Plans Section (Streamed via Suspense) ───────────────── */}
      <section id="plans" className="section" style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "400px",
            background: "radial-gradient(ellipse, rgba(124, 58, 237, 0.15) 0%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 10 }}>
          <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto var(--space-16)" }}>
            <div className="badge badge-violet" style={{ marginBottom: "var(--space-3)" }}>
              <Zap className="w-3.5 h-3.5" />
              <span>TRANSPARENT PRICING</span>
            </div>
            <h2 style={{ marginBottom: "var(--space-4)" }}>
              Choose Your <span className="text-gradient">Performance Tier</span>
            </h2>
            <p style={{ fontSize: "var(--text-lg)" }}>
              All plans include locker access, mobile app logging, and 100% money-back
              satisfaction guarantee for the first 14 days.
            </p>
          </div>

          <Suspense fallback={<PlansLoadingSkeleton />}>
            <PlansSection />
          </Suspense>
        </div>
      </section>

      {/* ── 5. Gym Locations Preview (Streamed via Suspense) ───────────────── */}
      <section id="locations" className="section" style={{ background: "rgba(255,255,255,0.01)" }}>
        <div className="container">
          <Suspense fallback={<LocationsLoadingSkeleton />}>
            <LocationsSection />
          </Suspense>

          <div style={{ textAlign: "center", marginTop: "var(--space-10)" }}>
            <Link href="/register" className="btn btn-ghost btn-lg">
              <span>View All 25+ Gym Locations & Amenities</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. Testimonials / Athlete Stories ───────────────────────────────── */}
      <section id="community" className="section">
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "650px", margin: "0 auto var(--space-16)" }}>
            <div className="badge badge-amber" style={{ marginBottom: "var(--space-3)" }}>
              <Award className="w-3.5 h-3.5" />
              <span>COMMUNITY STORIES</span>
            </div>
            <h2 style={{ marginBottom: "var(--space-4)" }}>
              Real Results From <span className="text-gradient">Real Athletes</span>
            </h2>
            <p style={{ fontSize: "var(--text-lg)" }}>
              Hear how everyday professionals and competitive lifters transformed their lives
              with GYM Fitness.
            </p>
          </div>

          <div className="grid grid-cols-3">
            {testimonials.map((t, idx) => (
              <div key={idx} className="card-glass" style={{ padding: "var(--space-8)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
                  <div style={{ display: "flex", gap: "3px" }}>
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber" style={{ fill: "currentColor" }} />
                    ))}
                  </div>
                  <span className="badge badge-emerald" style={{ fontSize: "0.65rem" }}>
                    {t.metric}
                  </span>
                </div>

                <p style={{ fontSize: "var(--text-sm)", fontStyle: "italic", marginBottom: "var(--space-6)", minHeight: "72px" }}>
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, rgba(124, 58, 237, 0.4), rgba(16, 185, 129, 0.3))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      color: "#fff",
                      fontSize: "var(--text-sm)",
                    }}
                  >
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "var(--text-sm)" }}>{t.name}</div>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Final High-Energy CTA Banner ─────────────────────────────────── */}
      <section className="section-sm">
        <div className="container">
          <div
            className="card-glow"
            style={{
              padding: "var(--space-16) var(--space-8)",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              background: "linear-gradient(145deg, rgba(124, 58, 237, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%), #0e0f19",
            }}
          >
            <div style={{ maxWidth: "660px", margin: "0 auto", position: "relative", zIndex: 5 }}>
              <div className="badge badge-emerald" style={{ marginBottom: "var(--space-4)" }}>
                <Flame className="w-3.5 h-3.5" />
                <span>LIMITED SPOTS REMAINING THIS MONTH</span>
              </div>

              <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "var(--space-4)" }}>
                Ready to Rewrite Your <span className="text-gradient">Physical Limits?</span>
              </h2>

              <p style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-8)" }}>
                Join over 50,000 members across India. Claim your 7-day complimentary all-access
                pass with full club and sauna privileges.
              </p>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-4)", flexWrap: "wrap" }}>
                <Link href="/register" className="btn btn-primary btn-xl">
                  <Sparkles className="w-5 h-5" />
                  <span>Claim Your Free Pass</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/login" className="btn btn-ghost btn-xl">
                  <span>Existing Member Sign In</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Global Footer ─────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}
