import React from "react";
import {
  CreditCard,
  Dumbbell,
  Users2,
  LineChart,
  Sparkles,
  Flame,
  ShieldCheck,
  Check,
} from "lucide-react";

export function FeaturesGrid() {
  const features = [
    {
      icon: <CreditCard className="w-6 h-6" />,
      tag: "FLAGSHIP PRIVILEGE",
      title: "All-India OnePass Access",
      desc: "Travel frequently? Your single membership card grants full biometric access across all 25+ clubs in Mumbai, Delhi, Bengaluru, Pune, Hyderabad, and more.",
      highlight: "25+ Metro Clubs Included",
      variant: "violet",
    },
    {
      icon: <Dumbbell className="w-6 h-6" />,
      tag: "EQUIPMENT TIER 1",
      title: "Olympic & Hammer Strength Rigs",
      desc: "Calibrated Eleiko competition bars, custom dumbbells up to 60kg, power cages, cable crossover towers, and specialized glute & belt squat machines.",
      highlight: "Biomechanical Precision",
      variant: "emerald",
    },
    {
      icon: <Users2 className="w-6 h-6" />,
      tag: "EXPERT GUIDANCE",
      title: "Certified Master Coaches",
      desc: "ACSM & ACE certified personal trainers creating scientific progressive overload programs, postural analysis, and form correction tailored to your goals.",
      highlight: "1-on-1 Personalized Coaching",
      variant: "violet",
    },
    {
      icon: <LineChart className="w-6 h-6" />,
      tag: "DIGITAL TRACKER",
      title: "Precision Metric & PR Logging",
      desc: "Log your sets, reps, body measurements, and 1-rep maximums directly in your member portal. Track historical curves with rich interactive Recharts visualizers.",
      highlight: "In-App Progress Dashboard",
      variant: "emerald",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      tag: "RECOVERY & WELLNESS",
      title: "Finnish Saunas & Steam Rooms",
      desc: "Accelerate muscle protein synthesis and recovery with dry cedar saunas, eucalyptus steam baths, and ice shower plunge zones in every premium club.",
      highlight: "Post-Workout Restoration",
      variant: "violet",
    },
    {
      icon: <Flame className="w-6 h-6" />,
      tag: "GROUP SESSIONS",
      title: "High-Octane CrossFit & Combat",
      desc: "Daily coach-led group classes ranging from high-intensity interval training (HIIT) and Olympic lifting to MMA boxing ring sparring and recovery yoga.",
      highlight: "Unlimited Classes on Gold & Above",
      variant: "emerald",
    },
  ];

  return (
    <section id="features" className="section" style={{ position: "relative" }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto var(--space-16)" }}>
          <div className="badge badge-emerald" style={{ marginBottom: "var(--space-3)" }}>
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>WHY CHOOSE GYM FITNESS</span>
          </div>
          <h2 style={{ marginBottom: "var(--space-4)" }}>
            Engineered For Those Who{" "}
            <span className="text-gradient">Demand Excellence</span>
          </h2>
          <p style={{ fontSize: "var(--text-lg)" }}>
            We combine high-performance sports science, elite gym equipment, and modern
            digital tracking to guarantee measurable physical results.
          </p>
        </div>

        {/* Features 3-Column Grid */}
        <div className="grid grid-cols-3">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className={`feature-icon-box ${f.variant === "emerald" ? "emerald" : ""}`}>
                {f.icon}
              </div>

              <div
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  color: f.variant === "emerald" ? "var(--color-emerald-300)" : "var(--color-violet-300)",
                  marginBottom: "var(--space-2)",
                }}
              >
                {f.tag}
              </div>

              <h3 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-3)" }}>
                {f.title}
              </h3>

              <p style={{ fontSize: "var(--text-sm)", marginBottom: "var(--space-5)" }}>
                {f.desc}
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  paddingTop: "var(--space-3)",
                  borderTop: "1px solid var(--border-subtle)",
                }}
              >
                <Check className="w-3.5 h-3.5 text-emerald" />
                <span>{f.highlight}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
