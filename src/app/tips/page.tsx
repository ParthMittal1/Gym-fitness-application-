"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  ShieldAlert,
  Moon,
  Utensils,
  Search,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Activity,
  HeartPulse,
  Apple,
  Dumbbell,
} from "lucide-react";
import "./tips.css";

interface TipItem {
  id: string;
  category: "form" | "recovery" | "nutrition";
  categoryLabel: string;
  question: string;
  answer: string;
  takeaways: string[];
  mistakes: string[];
}

const TIPS_DATA: TipItem[] = [
  // --- FORM SAFETY ---
  {
    id: "deadlift-form",
    category: "form",
    categoryLabel: "Form Safety",
    question: "How do I prevent lower-back strain during Conventional Deadlifts?",
    answer:
      "Lower back rounding during a deadlift occurs when hip drive is neglected and the bar drifts away from the shins. Initiate the pull by engaging your lats (imagine squeezing oranges in your armpits), pulling slack out of the barbell, and driving the floor away with your legs rather than pulling with your spine.",
    takeaways: [
      "Keep the barbell skimming your shins and thighs throughout the ascent.",
      "Engage your lats to lock the bar close to your center of gravity.",
      "Breathe into your diaphragm and brace with the Valsalva maneuver before lifting.",
    ],
    mistakes: [
      "Jerking the barbell off the floor before building tension.",
      "Hyperextending at the top of the lockout.",
      "Allowing the lower spine to flex (round) during lift-off.",
    ],
  },
  {
    id: "squat-depth",
    category: "form",
    categoryLabel: "Form Safety",
    question: "What is proper squat depth and how do I prevent knees caving in?",
    answer:
      "A standard full-depth squat requires hip crease dropping below the top of the patella (parallel or slightly below). Knee cave (valgus collapse) is caused by weak gluteus medius muscles or an unnatural stance. Flare your toes 15-30 degrees outward, root your feet ('screw your feet into the floor'), and actively push knees out in the direction of your toes.",
    takeaways: [
      "Establish a stable tripod foot: big toe, pinky toe, and heel firmly planted.",
      "Push your knees out along the line of your toes during the descent.",
      "Maintain a proud chest with your upper back tightly retracted.",
    ],
    mistakes: [
      "Letting knees collapse inward under heavy load.",
      "Shifting weight to your toes and raising heels off the mat.",
      "Relying on lumbar flexion to achieve artificial depth.",
    ],
  },
  {
    id: "bench-press-shoulder",
    category: "form",
    categoryLabel: "Form Safety",
    question: "How do I protect my shoulders and rotator cuffs while Bench Pressing?",
    answer:
      "Flaring elbows at 90 degrees puts maximum shearing stress on the anterior capsule and rotator cuffs. Tuck your elbows at a 45-60 degree angle to your torso, retract and depress your scapulae into the bench, and lower the bar to the lower sternum / nipple line rather than the throat.",
    takeaways: [
      "Retract and pin shoulder blades back and down before un-racking.",
      "Touch the bar softly to the mid-to-lower sternum with wrists stacked straight.",
      "Maintain continuous leg drive to stabilize the pelvis and ribcage.",
    ],
    mistakes: [
      "Flaring elbows wide at a 90-degree angle to the torso.",
      "Allowing wrists to roll backward into hyperextension.",
      "Bouncing the barbell violently off the chest cage.",
    ],
  },
  {
    id: "overhead-press",
    category: "form",
    categoryLabel: "Form Safety",
    question: "How do I avoid arching my lower back during Overhead Presses?",
    answer:
      "Excessive lumbar arching during strict overhead press is often compensation for tight thoracic spine mobility or a weak core brace. Squeeze your glutes tightly and flex your abs like taking a punch. As the barbell clears your forehead, move your head through the 'window' created by your arms.",
    takeaways: [
      "Contract glutes and quadriceps hard before pressing overhead.",
      "Push your head slightly forward once the bar clears eyebrow height.",
      "Keep forearms strictly vertical directly beneath the barbell.",
    ],
    mistakes: [
      "Turning the overhead press into an incline bench by leaning excessively back.",
      "Relaxing abdominal bracing midway through the repetition.",
      "Pressing the bar in an arc far forward from your center line.",
    ],
  },

  // --- RECOVERY GUIDES ---
  {
    id: "sleep-muscle-protein",
    category: "recovery",
    categoryLabel: "Recovery Guide",
    question: "Why is 7-9 hours of deep sleep non-negotiable for muscle growth?",
    answer:
      "Over 70% of natural human growth hormone (HGH) pulse release occurs during slow-wave non-REM deep sleep. Sleep deprivation increases circulating cortisol (a catabolic hormone) and blunts muscle protein synthesis (MPS) by up to 30%, while increasing systemic inflammation and injury susceptibility.",
    takeaways: [
      "Aim for 7 to 9 hours of uninterrupted sleep in a pitch-black, cool room (18-20°C).",
      "Avoid caffeine 6-8 hours before bed to preserve deep sleep architecture.",
      "Establish consistent circadian sleep and wake anchors, even on rest days.",
    ],
    mistakes: [
      "Sacrificing sleep to train early in the morning when chronically fatigued.",
      "Consuming heavy alcohol or high-sugar snacks right before bedtime.",
      "Staring at unblue-light filtered screens in bed.",
    ],
  },
  {
    id: "sauna-cold-plunge",
    category: "recovery",
    categoryLabel: "Recovery Guide",
    question: "Should I do ice baths or hot sauna sessions after hypertrophy workouts?",
    answer:
      "Cold water immersion (ice baths) immediately post-resistance training blunts the natural hormetic inflammatory response required for muscle hypertrophy. Reserve cold plunges for active recovery days or aerobic endurance. In contrast, post-workout sauna (15-20 mins) enhances heat shock proteins, growth hormone, and microvascular blood flow.",
    takeaways: [
      "Use infrared or Finnish sauna (15-20 mins) 2-3x weekly to improve vascular elasticity.",
      "Avoid cold water submersion within 4 hours of hypertrophy training.",
      "Rehydrate with sodium and potassium-rich fluids immediately after heat exposure.",
    ],
    mistakes: [
      "Taking freezing cold showers or ice baths immediately after heavy lifting.",
      "Staying in high-heat saunas when dehydrated or lightheaded.",
    ],
  },
  {
    id: "deload-protocol",
    category: "recovery",
    categoryLabel: "Recovery Guide",
    question: "When and how should I execute a planned Deload Week?",
    answer:
      "Every 5 to 8 weeks of progressive overload training accumulates central nervous system (CNS) and connective tissue fatigue. A deload week does not mean sitting on the couch: maintain movement patterns by reducing training volume (sets) by 40-50% and intensity (weight) by 10-20% to allow connective tissue repair.",
    takeaways: [
      "Schedule a deload when grip strength drops, joints ache, or sleep degrades.",
      "Keep exercise selection identical to retain neurological motor patterns.",
      "Cut sets from 4 to 2, keeping 3-4 reps in reserve (RIR).",
    ],
    mistakes: [
      "Training to muscular failure during a designated deload week.",
      "Skipping the gym entirely and losing neuromuscular groove.",
    ],
  },

  // --- NUTRITION SUGGESTIONS ---
  {
    id: "protein-timing",
    category: "nutrition",
    categoryLabel: "Nutrition",
    question: "What is the optimal daily protein intake and distribution across meals?",
    answer:
      "For resistance-trained athletes aiming for hypertrophy or fat loss preservation, 1.6 to 2.2 grams of protein per kilogram of total body weight (approx. 0.8 to 1.0g per pound) is the scientific gold standard. Distribute this into 3 to 5 meals spaced 3-4 hours apart, each containing at least 2.5-3g of leucine to trigger the mTOR pathway.",
    takeaways: [
      "Target 1.6 - 2.2g of protein per kg of body weight daily.",
      "Consume 25-40g of high-quality protein per meal to trigger muscle protein synthesis.",
      "Focus on complete sources: eggs, chicken, fish, whey/plant isolate, paneer, and tofu.",
    ],
    mistakes: [
      "Consuming 80% of your daily protein in a single evening meal.",
      "Ignoring protein quality and limiting essential amino acid profiles.",
    ],
  },
  {
    id: "pre-post-workout-fuel",
    category: "nutrition",
    categoryLabel: "Nutrition",
    question: "What should I eat before and after high-intensity training?",
    answer:
      "Pre-workout (1-2 hours prior): Consume easily digestible complex carbohydrates and lean protein (e.g., oatmeal with whey, or banana with Greek yogurt) with low dietary fat to prevent sluggish digestion. Post-workout (within 90 mins): Replenish depleted glycogen with fast carbs and provide 25-30g of fast-absorbing protein.",
    takeaways: [
      "Pre-workout: 30-50g carbs + 20g protein 60-90 minutes before lifting.",
      "Keep pre-workout fat low (<10g) to ensure rapid gastric emptying.",
      "Post-workout: Whey protein shake paired with dextrose, fruit, or rice cakes.",
    ],
    mistakes: [
      "Consuming high-fat, high-fiber meals 30 minutes before heavy squats.",
      "Fasting post-workout when training in a calorie deficit.",
    ],
  },
  {
    id: "creatine-hydration",
    category: "nutrition",
    categoryLabel: "Nutrition",
    question: "How should I take Creatine Monohydrate and manage daily hydration?",
    answer:
      "Creatine monohydrate is the most rigorously researched ergogenic aid in sports science. Take 3 to 5 grams daily at any consistent time with water. A 20g/day loading phase is optional but saturates muscle stores in 5-7 days instead of 3 weeks. Drink 3.5 to 4.5 liters of clean water daily, supplemented with sodium and potassium during sweaty sessions.",
    takeaways: [
      "3-5g of Creatine Monohydrate daily: timing doesn't matter, consistency does.",
      "No cycling required; long-term daily usage is safe for healthy kidneys.",
      "Drink at least 3.5 liters of water daily to support intramuscular water retention.",
    ],
    mistakes: [
      "Stopping creatine after 4 weeks assuming you need to 'cycle off'.",
      "Buying expensive buffered or ester varieties; pure monohydrate has the highest efficacy.",
    ],
  },
];

export default function TipsPage() {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "form" | "recovery" | "nutrition">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "deadlift-form": true,
    "sleep-muscle-protein": true,
  });

  const toggleAccordion = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredTips = TIPS_DATA.filter((tip) => {
    const matchesCategory = selectedCategory === "all" || tip.category === selectedCategory;
    const matchesSearch =
      tip.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.takeaways.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main className="tips-container" style={{ flex: 1 }}>
        {/* Header */}
        <div className="tips-header">
          <div className="tips-badge">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KNOWLEDGE HUB</span>
          </div>
          <h1 className="tips-title">
            Fitness Science & <span className="text-gradient">Performance Guides</span>
          </h1>
          <p className="tips-subtitle">
            Evidence-based biomechanics, neuromuscular recovery protocols, and precision nutrition advice curated by our certified elite strength coaches.
          </p>
        </div>

        {/* 3 Top Highlights */}
        <div className="tips-highlights-grid">
          <div className="tips-highlight-card">
            <div className="tips-highlight-icon-wrap" style={{ background: "rgba(124, 58, 237, 0.15)", color: "#a78bfa" }}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="tips-highlight-content">
              <h4>Form Safety First</h4>
              <p>Protect spinal integrity, shoulder joints, and knees with verified barbell biomechanics cues.</p>
            </div>
          </div>

          <div className="tips-highlight-card">
            <div className="tips-highlight-icon-wrap" style={{ background: "rgba(59, 130, 246, 0.15)", color: "#60a5fa" }}>
              <Moon className="w-5 h-5" />
            </div>
            <div className="tips-highlight-content">
              <h4>Active Recovery</h4>
              <p>Optimize sleep architecture, deload periods, and thermal therapy to accelerate hypertrophy.</p>
            </div>
          </div>

          <div className="tips-highlight-card">
            <div className="tips-highlight-icon-wrap" style={{ background: "rgba(16, 185, 129, 0.15)", color: "var(--color-emerald)" }}>
              <Utensils className="w-5 h-5" />
            </div>
            <div className="tips-highlight-content">
              <h4>Nutrition Science</h4>
              <p>Calibrate protein synthesis, macronutrient timing, and proven creatine supplementation.</p>
            </div>
          </div>
        </div>

        {/* Controls: Category Filter Tabs & Search */}
        <div className="tips-controls">
          <div className="tips-tabs">
            <button
              type="button"
              className={`tips-tab-btn ${selectedCategory === "all" ? "active" : ""}`}
              onClick={() => setSelectedCategory("all")}
            >
              <Activity className="w-4 h-4" />
              <span>All Guides ({TIPS_DATA.length})</span>
            </button>
            <button
              type="button"
              className={`tips-tab-btn ${selectedCategory === "form" ? "active" : ""}`}
              onClick={() => setSelectedCategory("form")}
            >
              <Dumbbell className="w-4 h-4" />
              <span>Form Safety</span>
            </button>
            <button
              type="button"
              className={`tips-tab-btn ${selectedCategory === "recovery" ? "active" : ""}`}
              onClick={() => setSelectedCategory("recovery")}
            >
              <HeartPulse className="w-4 h-4" />
              <span>Recovery</span>
            </button>
            <button
              type="button"
              className={`tips-tab-btn ${selectedCategory === "nutrition" ? "active" : ""}`}
              onClick={() => setSelectedCategory("nutrition")}
            >
              <Apple className="w-4 h-4" />
              <span>Nutrition</span>
            </button>
          </div>

          <div className="tips-search-box">
            <Search className="w-4 h-4 tips-search-icon" />
            <input
              type="text"
              placeholder="Search tips, cues, supplements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="tips-search-input"
            />
          </div>
        </div>

        {/* Accordion FAQ list */}
        {filteredTips.length === 0 ? (
          <div className="tips-empty">
            <AlertTriangle className="w-8 h-8 text-muted" style={{ margin: "0 auto var(--space-3)" }} />
            <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 700, color: "var(--text-primary)" }}>
              No guides match &ldquo;{searchQuery}&rdquo;
            </h3>
            <p style={{ fontSize: "var(--text-sm)", marginTop: "4px" }}>
              Try searching for &quot;deadlift&quot;, &quot;protein&quot;, &quot;creatine&quot;, or &quot;sleep&quot;.
            </p>
          </div>
        ) : (
          <div className="tips-accordion">
            {filteredTips.map((tip) => {
              const isOpen = !!openItems[tip.id];

              return (
                <div key={tip.id} className={`tip-accordion-item ${isOpen ? "open" : ""}`}>
                  <button
                    type="button"
                    className="tip-accordion-trigger"
                    onClick={() => toggleAccordion(tip.id)}
                    aria-expanded={isOpen}
                  >
                    <div className="tip-trigger-left">
                      <span className={`tip-category-tag tip-category-${tip.category}`}>
                        {tip.categoryLabel}
                      </span>
                      <span className="tip-trigger-title">{tip.question}</span>
                    </div>
                    <ChevronDown className="w-5 h-5 tip-chevron" />
                  </button>

                  {isOpen && (
                    <div className="tip-accordion-content">
                      <p className="tip-main-text">{tip.answer}</p>

                      <div className="tip-grid-blocks">
                        <div className="tip-key-takeaways">
                          <h5>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Key Execution Cues
                          </h5>
                          <ul className="tip-takeaway-list">
                            {tip.takeaways.map((takeaway, idx) => (
                              <li key={idx}>
                                <span style={{ color: "var(--color-emerald)", fontWeight: 700 }}>•</span>
                                <span>{takeaway}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="tip-mistakes-block">
                          <h5>
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Common Pitfalls to Avoid
                          </h5>
                          <ul className="tip-mistakes-list">
                            {tip.mistakes.map((mistake, idx) => (
                              <li key={idx}>
                                <span style={{ color: "#f87171", fontWeight: 700 }}>×</span>
                                <span>{mistake}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Banner */}
        <div
          style={{
            marginTop: "var(--space-12)",
            padding: "var(--space-8)",
            borderRadius: "var(--radius-xl)",
            background: "linear-gradient(135deg, rgba(124, 58, 237, 0.12), rgba(16, 185, 129, 0.08))",
            border: "1px solid rgba(124, 58, 237, 0.3)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "var(--space-4)",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "rgba(16, 185, 129, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-emerald)",
            }}
          >
            <Flame className="w-6 h-6" />
          </div>
          <h3 style={{ fontSize: "var(--text-xl)", fontWeight: 800 }}>
            Ready to apply these principles to your training?
          </h3>
          <p style={{ color: "var(--text-secondary)", maxWidth: "560px", fontSize: "var(--text-sm)" }}>
            Explore our curated workout routines or head over to the workout logger inside your dashboard to track weights, sets, and personal records.
          </p>
          <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/workouts" className="btn btn-primary btn-md">
              Browse Workout Plans
            </Link>
            <Link href="/dashboard" className="btn btn-secondary btn-md">
              Athlete Dashboard
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
