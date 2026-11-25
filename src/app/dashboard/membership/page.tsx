import React, { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatINR } from "@/lib/razorpay";
import "./membership.css";
import {
  CreditCard,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Dumbbell,
  Receipt,
  MapPin,
  Clock,
  Wifi,
  QrCode,
  AlertCircle,
} from "lucide-react";

async function MembershipViewContent() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard/membership");
  }

  // Fetch active or latest membership
  const membership = await db.membership.findFirst({
    where: { userId: session.user.id },
    include: { plan: true },
    orderBy: { createdAt: "desc" },
  });

  // Fetch billing transactions
  const payments = await db.payment.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  const isActive =
    membership &&
    membership.status === "ACTIVE" &&
    new Date(membership.endDate) > new Date();

  const tier = membership?.plan?.tier || "GOLD";
  const tierClass =
    tier === "PLATINUM"
      ? "card-tier-platinum"
      : tier === "SILVER"
      ? "card-tier-silver"
      : "card-tier-gold";

  return (
    <div className="membership-container">
      {/* Page Header */}
      <div className="membership-header-block">
        <div className="badge badge-emerald" style={{ marginBottom: "var(--space-2)" }}>
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>BIOMETRIC ACCESS PASS</span>
        </div>
        <h1 style={{ fontSize: "var(--text-4xl)", marginBottom: "var(--space-2)" }}>
          Membership & Virtual Gym Card
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-base)" }}>
          Your digital biometric card grants instant contactless turnstile entry across all 25+
          nationwide clubs.
        </p>
      </div>

      {membership && isActive ? (
        <>
          {/* ── Virtual Card & Details 2-Column Grid ────────────────────────── */}
          <div className="membership-grid-layout">
            {/* Left: Virtual Gym Card */}
            <div className="virtual-card-wrapper animate-scale-in">
              <div className={`virtual-gym-card ${tierClass}`}>
                {/* Top Row: Brand & Pass Tag */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "8px",
                        background: "rgba(255, 255, 255, 0.12)",
                        border: "1px solid rgba(255, 255, 255, 0.25)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Dumbbell className="w-5 h-5 text-emerald" />
                    </div>
                    <div>
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 800,
                          fontSize: "var(--text-base)",
                          letterSpacing: "0.04em",
                          color: "#fff",
                        }}
                      >
                        GYM<span className="text-gradient">.FITNESS</span>
                      </span>
                      <span
                        style={{
                          display: "block",
                          fontSize: "0.6rem",
                          letterSpacing: "0.14em",
                          color: "var(--text-muted)",
                          fontWeight: 600,
                        }}
                      >
                        ALL-INDIA CLUB ACCESS
                      </span>
                    </div>
                  </div>

                  <span
                    className={`badge ${
                      tier === "PLATINUM"
                        ? "badge-amber"
                        : tier === "SILVER"
                        ? "badge-sky"
                        : "badge-violet"
                    }`}
                  >
                    {tier} PASS
                  </span>
                </div>

                {/* Metallic Smart Chip & Contactless Waves */}
                <div className="card-chip-row">
                  <div className="card-smart-chip" />
                  <Wifi
                    className="w-5 h-5"
                    style={{
                      transform: "rotate(90deg)",
                      color: "rgba(255,255,255,0.6)",
                    }}
                  />
                </div>

                {/* Card Number */}
                <div>
                  <div style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "2px" }}>
                    CARD NUMBER
                  </div>
                  <div className="card-number-display">
                    {membership.cardNumber}
                  </div>
                </div>

                {/* Bottom Row: Athlete Name, Expiry, & Decorative QR Code */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div>
                    <div style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--text-muted)" }}>
                      ATHLETE NAME
                    </div>
                    <div style={{ fontSize: "var(--text-base)", fontWeight: 700, color: "#fff" }}>
                      {session.user.name || "Elite Athlete"}
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--text-muted)" }}>
                      VALID THRU
                    </div>
                    <div style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--color-emerald-300)" }}>
                      {new Date(membership.endDate).toLocaleDateString("en-IN", {
                        month: "short",
                        year: "numeric",
                        day: "numeric",
                      })}
                    </div>
                  </div>

                  {/* Decorative QR Code for turnstile scanning */}
                  <div className="card-qr-box" title="Scan at turnstile for club entry">
                    <svg
                      className="card-qr-svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Stylized QR Code matrix representation */}
                      <rect x="2" y="2" width="7" height="7" rx="1" fill="#000" />
                      <rect x="4" y="4" width="3" height="3" fill="#fff" />
                      <rect x="15" y="2" width="7" height="7" rx="1" fill="#000" />
                      <rect x="17" y="4" width="3" height="3" fill="#fff" />
                      <rect x="2" y="15" width="7" height="7" rx="1" fill="#000" />
                      <rect x="4" y="17" width="3" height="3" fill="#fff" />
                      <rect x="11" y="4" width="2" height="2" fill="#000" />
                      <rect x="11" y="8" width="2" height="4" fill="#000" />
                      <rect x="4" y="11" width="2" height="2" fill="#000" />
                      <rect x="8" y="11" width="2" height="2" fill="#000" />
                      <rect x="15" y="11" width="2" height="2" fill="#000" />
                      <rect x="19" y="11" width="2" height="2" fill="#000" />
                      <rect x="11" y="15" width="3" height="3" fill="#000" />
                      <rect x="16" y="15" width="2" height="2" fill="#000" />
                      <rect x="16" y="19" width="4" height="2" fill="#000" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Membership Subscription Details */}
            <div className="membership-details-card">
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: "var(--color-emerald-400)",
                        boxShadow: "var(--glow-emerald-sm)",
                      }}
                    />
                    <span style={{ fontWeight: 700, fontSize: "var(--text-sm)", color: "var(--color-emerald-300)" }}>
                      ACTIVE SUBSCRIPTION
                    </span>
                  </div>

                  <div style={{ fontSize: "var(--text-xl)", fontWeight: 800 }}>
                    {formatINR(membership.plan.price)}
                    <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", fontWeight: 400 }}>
                      {" "}
                      / mo
                    </span>
                  </div>
                </div>

                <h3 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-2)" }}>
                  {membership.plan.name} Plan
                </h3>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", marginBottom: "var(--space-6)" }}>
                  {membership.plan.description}
                </p>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div className="details-row-item">
                    <span style={{ color: "var(--text-muted)" }}>Membership Tier:</span>
                    <span style={{ fontWeight: 600 }}>{membership.plan.tier}</span>
                  </div>
                  <div className="details-row-item">
                    <span style={{ color: "var(--text-muted)" }}>Card ID:</span>
                    <code style={{ color: "var(--color-violet-200)", fontWeight: 700 }}>
                      {membership.cardNumber}
                    </code>
                  </div>
                  <div className="details-row-item">
                    <span style={{ color: "var(--text-muted)" }}>Valid Start Date:</span>
                    <span style={{ fontWeight: 600 }}>
                      {new Date(membership.startDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="details-row-item">
                    <span style={{ color: "var(--text-muted)" }}>Expires / Renews:</span>
                    <span style={{ fontWeight: 700, color: "var(--color-emerald-300)" }}>
                      {new Date(membership.endDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="details-row-item">
                    <span style={{ color: "var(--text-muted)" }}>Club Entry:</span>
                    <span style={{ fontWeight: 600 }}>25+ Locations Nationwide</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-6)" }}>
                <Link href="/#plans" className="btn btn-ghost btn-full" style={{ justifyContent: "center" }}>
                  <span>Upgrade Tier</span>
                </Link>
                <Link href="/#locations" className="btn btn-secondary btn-full" style={{ justifyContent: "center" }}>
                  <MapPin className="w-4 h-4" />
                  <span>Gym Locations</span>
                </Link>
              </div>
            </div>
          </div>

          {/* ── Payment & Billing Records Table ───────────────────────────── */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "var(--space-4)" }}>
              <Receipt className="w-5 h-5 text-emerald" />
              <h3 style={{ fontSize: "var(--text-xl)" }}>Billing & Payment History</h3>
            </div>

            {payments.length === 0 ? (
              <div className="card" style={{ padding: "var(--space-6)", textAlign: "center", color: "var(--text-muted)" }}>
                No payment transactions recorded yet.
              </div>
            ) : (
              <div className="transactions-table-card">
                <div className="table-responsive-wrapper">
                  <table className="transactions-table">
                    <thead>
                      <tr>
                        <th>Order / Payment ID</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((p) => (
                        <tr key={p.id}>
                          <td style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)" }}>
                            {p.razorpayOrderId || p.id.slice(0, 14)}
                          </td>
                          <td>{p.description || "GYM Membership"}</td>
                          <td style={{ fontWeight: 700, color: "var(--color-emerald-300)" }}>
                            {formatINR(p.amount)}
                          </td>
                          <td style={{ color: "var(--text-secondary)" }}>
                            {new Date(p.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                p.status === "SUCCESS"
                                  ? "badge-emerald"
                                  : p.status === "PENDING"
                                  ? "badge-amber"
                                  : "badge-rose"
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        /* ── Empty State: No Active Membership ─────────────────────────────── */
        <div className="no-membership-card">
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "rgba(124, 58, 237, 0.15)",
              border: "2px solid rgba(124, 58, 237, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto var(--space-4)",
            }}
          >
            <CreditCard className="w-8 h-8 text-violet" />
          </div>

          <h2 style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-3)" }}>
            No Active Membership
          </h2>

          <p style={{ maxWidth: "520px", margin: "0 auto var(--space-8)", color: "var(--text-secondary)", fontSize: "var(--text-base)" }}>
            You do not currently hold an active gym pass. Select one of our Silver, Gold, or
            Platinum subscription plans to unlock 25+ nationwide athletic clubs, group HIIT
            classes, and digital workout tracking.
          </p>

          <Link href="/#plans" className="btn btn-primary btn-xl">
            <Sparkles className="w-5 h-5" />
            <span>Explore Pricing & Membership Plans</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      )}
    </div>
  );
}

function MembershipLoadingSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
      <div className="card skeleton" style={{ minHeight: "280px" }} />
      <div className="card skeleton" style={{ minHeight: "220px" }} />
    </div>
  );
}

export default function MembershipDetailPage() {
  return (
    <Suspense fallback={<MembershipLoadingSkeleton />}>
      <MembershipViewContent />
    </Suspense>
  );
}
