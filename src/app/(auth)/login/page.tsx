"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const urlError = searchParams.get("error");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Validate form client-side
  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    const emailTrimmed = formData.email.trim();
    if (!emailTrimmed) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear specific field error as user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
      });

      if (res?.error) {
        setIsLoading(false);
        setErrors({
          general:
            res.error === "CredentialsSignin"
              ? "Invalid email or password. Please verify your credentials."
              : res.error,
        });
        return;
      }

      setIsSuccess(true);
      // Give a brief moment for the user to register success then redirect
      setTimeout(() => {
        router.push(callbackUrl);
        router.refresh();
      }, 700);
    } catch {
      setIsLoading(false);
      setErrors({
        general: "A connection error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <div className="badge badge-violet" style={{ marginBottom: "var(--space-2)" }}>
          <Sparkles className="w-3 h-3" />
          <span>MEMBER PORTAL</span>
        </div>
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">
          Enter your credentials to access your workout logs, active plan, and stats.
        </p>
      </div>

      {/* URL Error Banner (e.g. from middleware redirect or session expiry) */}
      {urlError && !errors.general && (
        <div className="auth-alert-error" role="alert">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Authentication session expired. Please sign in again.</span>
        </div>
      )}

      {/* Submission Error Banner */}
      {errors.general && (
        <div className="auth-alert-error" role="alert">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errors.general}</span>
        </div>
      )}

      {/* Success Notification */}
      {isSuccess && (
        <div className="auth-alert-success" role="status">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Authenticated successfully! Redirecting to dashboard...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Email Field */}
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            <span>Email Address</span>
          </label>
          <div className="input-wrapper">
            <Mail className="input-icon w-4 h-4" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="athlete@gymfitness.app"
              value={formData.email}
              onChange={handleChange}
              className={`auth-input ${errors.email ? "error" : ""}`}
              disabled={isLoading || isSuccess}
            />
          </div>
          {errors.email && (
            <span className="field-error">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.email}
            </span>
          )}
        </div>

        {/* Password Field */}
        <div className="form-group">
          <div className="form-label">
            <label htmlFor="password">Password</label>
            <Link
              href="/forgot-password"
              className="auth-link-subtle"
              tabIndex={-1}
            >
              Forgot password?
            </Link>
          </div>
          <div className="input-wrapper">
            <Lock className="input-icon w-4 h-4" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••••••"
              value={formData.password}
              onChange={handleChange}
              className={`auth-input ${errors.password ? "error" : ""}`}
              disabled={isLoading || isSuccess}
            />
            <button
              type="button"
              className="input-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <span className="field-error">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.password}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary btn-lg btn-full"
          style={{ marginTop: "var(--space-6)" }}
          disabled={isLoading || isSuccess}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying Credentials...</span>
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Signed In!</span>
            </>
          ) : (
            <>
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer Switch to Register */}
      <div className="auth-footer-prompt">
        <span>Don&apos;t have an athlete account?</span>{" "}
        <Link href="/register" className="auth-link-highlight">
          Join GYM Fitness →
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="auth-card" style={{ display: "flex", justifyContent: "center", padding: "var(--space-12)" }}>
          <Loader2 className="w-8 h-8 animate-spin text-emerald" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
