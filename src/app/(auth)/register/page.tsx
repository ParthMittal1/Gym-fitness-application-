"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
  ChevronDown,
} from "lucide-react";

// Indian cities matching our nationwide gym footprint
const MAJOR_INDIAN_CITIES = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Pune",
  "Hyderabad",
  "Chennai",
  "Ahmedabad",
  "Kolkata",
  "Gurugram",
  "Noida",
  "Jaipur",
  "Chandigarh",
  "Surat",
  "Indore",
  "Kochi",
];

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    city: "Mumbai",
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
    city?: string;
    general?: string;
  }>({});

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Client-side form validation
  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Name check
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    // Email check
    const emailTrimmed = formData.email.trim();
    if (!emailTrimmed) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Password check: min 8 chars, 1 uppercase, 1 lowercase, 1 digit
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Include at least one uppercase letter, one lowercase letter, and one number.";
    }

    // Phone check (optional, but if provided must be 10 digits Indian format)
    const phoneTrimmed = formData.phone.trim();
    if (phoneTrimmed && !/^[6-9]\d{9}$/.test(phoneTrimmed)) {
      newErrors.phone = "Enter a valid 10-digit Indian mobile number (e.g. 9876543210).";
    }

    // City check
    if (!formData.city) {
      newErrors.city = "Please select your primary city.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

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
      // 1. Send registration request to backend endpoint
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
          phone: formData.phone.trim() || undefined,
          city: formData.city,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        if (data.errors && Array.isArray(data.errors)) {
          const fieldErrors: typeof errors = {};
          data.errors.forEach((err: { field: string; message: string }) => {
            fieldErrors[err.field as keyof typeof errors] = err.message;
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ general: data.message || "Registration failed." });
        }
        return;
      }

      // 2. Automatically log the new user in via NextAuth CredentialsProvider
      setIsSuccess(true);

      const loginRes = await signIn("credentials", {
        redirect: false,
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
      });

      if (loginRes?.ok) {
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 800);
      } else {
        // Fallback: redirect to login if auto-login fails
        setTimeout(() => {
          router.push("/login?registered=true");
        }, 1000);
      }
    } catch {
      setIsLoading(false);
      setErrors({ general: "Network connection error. Please try again." });
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <div className="badge badge-emerald" style={{ marginBottom: "var(--space-2)" }}>
          <Sparkles className="w-3 h-3" />
          <span>JOIN THE MOVEMENT</span>
        </div>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">
          Start your transformation today with all-access gym passes and workouts.
        </p>
      </div>

      {/* General Submission Error */}
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
          <span>Account created! Signing you in to your dashboard...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Full Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="name">
            Full Name
          </label>
          <div className="input-wrapper">
            <User className="input-icon w-4 h-4" />
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="e.g. Aryan Sharma"
              value={formData.name}
              onChange={handleChange}
              className={`auth-input ${errors.name ? "error" : ""}`}
              disabled={isLoading || isSuccess}
            />
          </div>
          {errors.name && (
            <span className="field-error">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.name}
            </span>
          )}
        </div>

        {/* Email Address */}
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email Address
          </label>
          <div className="input-wrapper">
            <Mail className="input-icon w-4 h-4" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="aryan@example.com"
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

        {/* Password */}
        <div className="form-group">
          <label className="form-label" htmlFor="password">
            <span>Password</span>
            <span style={{ textTransform: "none", color: "var(--text-muted)", fontSize: "0.7rem" }}>
              Min 8 chars, 1 capital, 1 number
            </span>
          </label>
          <div className="input-wrapper">
            <Lock className="input-icon w-4 h-4" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a strong password"
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

        {/* 2-Column Row: Phone & City */}
        <div className="auth-form-row">
          {/* Phone Number */}
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label" htmlFor="phone">
              Mobile Number
            </label>
            <div className="input-wrapper">
              <Phone className="input-icon w-4 h-4" />
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleChange}
                className={`auth-input ${errors.phone ? "error" : ""}`}
                disabled={isLoading || isSuccess}
              />
            </div>
            {errors.phone && (
              <span className="field-error">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.phone}
              </span>
            )}
          </div>

          {/* Primary City Dropdown */}
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label" htmlFor="city">
              Primary City
            </label>
            <div className="input-wrapper">
              <MapPin className="input-icon w-4 h-4" />
              <select
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`auth-select ${errors.city ? "error" : ""}`}
                disabled={isLoading || isSuccess}
              >
                {MAJOR_INDIAN_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="w-4 h-4"
                style={{
                  position: "absolute",
                  right: "var(--space-3)",
                  pointerEvents: "none",
                  color: "var(--text-muted)",
                }}
              />
            </div>
            {errors.city && (
              <span className="field-error">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.city}
              </span>
            )}
          </div>
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
              <span>Creating Your Account...</span>
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Account Created!</span>
            </>
          ) : (
            <>
              <span>Register & Start Training</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer Switch to Login */}
      <div className="auth-footer-prompt">
        <span>Already have an athlete account?</span>{" "}
        <Link href="/login" className="auth-link-highlight">
          Sign In →
        </Link>
      </div>
    </div>
  );
}
