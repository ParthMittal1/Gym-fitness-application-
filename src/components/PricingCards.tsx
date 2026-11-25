"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Check,
  ArrowRight,
  Loader2,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  X,
  Zap,
  CheckCircle2,
  CreditCard,
} from "lucide-react";
import { formatINR } from "@/lib/razorpay";

interface PlanItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  duration: number;
  tier: string;
  description: string | null;
  features: string;
  popular: boolean;
  active: boolean;
}

interface MockOrderData {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  isMock: boolean;
  plan: {
    id: string;
    name: string;
    tier: string;
    price: number;
    duration: number;
  };
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export function PricingCards({ plans }: { plans: PlanItem[] }) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const [modalData, setModalData] = useState<MockOrderData | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Helper to load Razorpay script for live/test transactions
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as unknown as { Razorpay?: unknown }).Razorpay) {
        return resolve(true);
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSelectPlan = async (plan: PlanItem) => {
    // 1. If not authenticated, prompt sign-in
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=/#plans`);
      return;
    }

    setLoadingPlanId(plan.id);
    setErrorMessage(null);

    try {
      // 2. Call backend order creation endpoint
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id }),
      });

      const orderData = await res.json();

      if (!res.ok) {
        setErrorMessage(orderData.message || "Failed to initiate transaction.");
        setLoadingPlanId(null);
        return;
      }

      // 3. If Sandbox / Mock mode is returned
      if (orderData.isMock) {
        setLoadingPlanId(null);
        setModalData(orderData);
        return;
      }

      // 4. Live / Real Razorpay flow
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setErrorMessage("Razorpay payment gateway failed to load. Please try again.");
        setLoadingPlanId(null);
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount * 100, // paise
        currency: orderData.currency || "INR",
        name: "GYM Fitness India",
        description: `${plan.name} (${plan.tier}) Membership`,
        order_id: orderData.orderId,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          setIsVerifying(true);
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                planId: plan.id,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              setVerifySuccess(true);
              setTimeout(() => {
                router.push("/dashboard/membership");
              }, 1200);
            } else {
              setErrorMessage(verifyData.message || "Payment verification failed.");
            }
          } catch {
            setErrorMessage("Payment verification connection error.");
          } finally {
            setIsVerifying(false);
            setLoadingPlanId(null);
          }
        },
        prefill: {
          name: session?.user?.name || "",
          email: session?.user?.email || "",
        },
        theme: {
          color: "#7c3aed",
        },
      };

      const razorpayWindow = (
        window as unknown as {
          Razorpay: new (opts: typeof options) => { open: () => void };
        }
      ).Razorpay;

      const rzp = new razorpayWindow(options);
      rzp.open();
      setLoadingPlanId(null);
    } catch {
      setErrorMessage("Network error initiating payment.");
      setLoadingPlanId(null);
    }
  };

  // Mock Sandbox Simulator verification trigger
  const handleSimulateSuccess = async () => {
    if (!modalData) return;

    setIsVerifying(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpayOrderId: modalData.orderId,
          razorpayPaymentId: `pay_mock_${Date.now()}_${Math.random()
            .toString(36)
            .substring(2, 6)}`,
          razorpaySignature: "mock_signature",
          planId: modalData.plan.id,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setVerifySuccess(true);
        setTimeout(() => {
          router.push("/dashboard/membership");
        }, 1200);
      } else {
        setErrorMessage(data.message || "Mock payment verification failed.");
      }
    } catch {
      setErrorMessage("Simulation request failed.");
    } finally {
      setIsVerifying(false);
    }
  };

  const closeModal = () => {
    if (!isVerifying) {
      setModalData(null);
      setErrorMessage(null);
      setVerifySuccess(false);
    }
  };

  return (
    <>
      {/* Global Error Banner */}
      {errorMessage && (
        <div
          className="auth-alert-error"
          style={{ maxWidth: "600px", margin: "0 auto var(--space-6)" }}
        >
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 3-Tier Pricing Grid */}
      <div className="pricing-grid">
        {plans.map((plan) => {
          let parsedFeatures: string[] = [];
          try {
            parsedFeatures = JSON.parse(plan.features);
          } catch {
            parsedFeatures = [plan.features];
          }

          const isLoading = loadingPlanId === plan.id;

          return (
            <div
              key={plan.id}
              className={`pricing-card ${plan.popular ? "popular" : ""}`}
            >
              {plan.popular && (
                <div className="popular-ribbon">
                  ⭐ MOST POPULAR
                </div>
              )}

              <div style={{ marginBottom: "var(--space-4)" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "var(--space-2)",
                  }}
                >
                  <h3 style={{ fontSize: "var(--text-2xl)" }}>{plan.name}</h3>
                  <span
                    className={`badge ${
                      plan.tier === "PLATINUM"
                        ? "badge-amber"
                        : plan.tier === "GOLD"
                        ? "badge-violet"
                        : "badge-muted"
                    }`}
                  >
                    {plan.tier}
                  </span>
                </div>
                <p style={{ fontSize: "var(--text-xs)", minHeight: "36px" }}>
                  {plan.description}
                </p>
              </div>

              {/* Price Block */}
              <div className="pricing-price-wrap">
                <span
                  style={{
                    fontSize: "var(--text-xl)",
                    fontWeight: 700,
                    color: "var(--color-emerald-400)",
                  }}
                >
                  ₹
                </span>
                <span className="pricing-amount">
                  {plan.price.toLocaleString("en-IN")}
                </span>
                <span className="pricing-period">/ month</span>
              </div>

              <div
                style={{
                  height: "1px",
                  background: "var(--border-subtle)",
                  marginBlock: "var(--space-2) var(--space-4)",
                }}
              />

              {/* Feature Checkmarks */}
              <div className="pricing-features-list">
                {parsedFeatures.map((feat, idx) => (
                  <div key={idx} className="pricing-feature-item">
                    <Check
                      className="w-4 h-4 text-emerald"
                      style={{ flexShrink: 0, marginTop: "2px" }}
                    />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => handleSelectPlan(plan)}
                disabled={isLoading}
                className={`btn btn-lg btn-full ${
                  plan.popular ? "btn-primary" : "btn-ghost"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Initiating Checkout...</span>
                  </>
                ) : (
                  <>
                    <span>Choose {plan.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* ─── Custom Glassmorphism Sandbox Simulator Modal ─────────────────── */}
      {modalData && (
        <div className="payment-modal-backdrop animate-fade-in" onClick={closeModal}>
          <div
            className="payment-modal-card animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            {!isVerifying && !verifySuccess && (
              <button
                type="button"
                onClick={closeModal}
                style={{
                  position: "absolute",
                  top: "var(--space-5)",
                  right: "var(--space-5)",
                  background: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                }}
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Sandbox Simulator Badge */}
            <div className="payment-simulator-badge">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Razorpay Sandbox Simulator</span>
            </div>

            <h3 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-2)" }}>
              {verifySuccess ? "Membership Activated!" : "Complete Subscription"}
            </h3>

            <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
              {verifySuccess
                ? "Your mock payment has been processed and your All-India gym card is now live."
                : "Development environment detected. You can safely simulate a successful Razorpay transaction without real charges."}
            </p>

            {/* Success State Animation */}
            {verifySuccess ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "var(--space-8) 0",
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "rgba(16, 185, 129, 0.15)",
                    border: "2px solid var(--color-emerald-400)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto var(--space-4)",
                  }}
                >
                  <CheckCircle2 className="w-8 h-8 text-emerald" />
                </div>
                <div style={{ fontSize: "var(--text-lg)", fontWeight: 700, marginBottom: "var(--space-2)" }}>
                  Payment Verified
                </div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                  Redirecting to your digital member card...
                </div>
              </div>
            ) : (
              <>
                {/* Order Summary Box */}
                <div className="payment-summary-box">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "var(--space-3)",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "var(--text-base)" }}>
                        {modalData.plan.name} Tier
                      </div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                        {modalData.plan.duration} Month All-India Access
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: "var(--text-2xl)",
                        fontWeight: 800,
                        color: "var(--color-emerald-400)",
                      }}
                    >
                      {formatINR(modalData.amount)}
                    </div>
                  </div>

                  <div
                    style={{
                      height: "1px",
                      background: "var(--border-subtle)",
                      marginBlock: "var(--space-3)",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "var(--text-xs)",
                      color: "var(--text-secondary)",
                      marginBottom: "6px",
                    }}
                  >
                    <span>Simulated Order ID:</span>
                    <code
                      style={{
                        background: "rgba(255, 255, 255, 0.06)",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        color: "var(--color-violet-200)",
                      }}
                    >
                      {modalData.orderId}
                    </code>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "var(--text-xs)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <span>Athlete Name:</span>
                    <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                      {modalData.user.name || "GYM Athlete"}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 12px",
                    borderRadius: "var(--radius-md)",
                    background: "rgba(124, 58, 237, 0.08)",
                    border: "1px solid rgba(124, 58, 237, 0.2)",
                    fontSize: "var(--text-xs)",
                    color: "var(--color-violet-200)",
                    marginBottom: "var(--space-6)",
                  }}
                >
                  <CreditCard className="w-4 h-4 flex-shrink-0" />
                  <span>
                    Simulates instant HMAC webhook callback & creates an active membership in SQLite.
                  </span>
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: "var(--space-3)" }}>
                  <button
                    type="button"
                    onClick={handleSimulateSuccess}
                    disabled={isVerifying}
                    className="btn btn-primary btn-lg"
                    style={{ flex: 2 }}
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying Mock Signature...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>Simulate Success</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={isVerifying}
                    className="btn btn-ghost btn-lg"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
