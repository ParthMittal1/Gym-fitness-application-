"use client";

import React from "react";
import Link from "next/link";
import {
  Dumbbell,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Mail,
  Phone,
  MapPin,
  Heart,
  ArrowRight,
} from "lucide-react";

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="site-footer">
      <div className="container">
        {/* Top 4-Column Grid */}
        <div className="footer-main-grid">
          {/* Col 1: Brand & Bio */}
          <div>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "10px", textDecoration: "none", marginBottom: "var(--space-4)" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "var(--radius-md)",
                  background: "linear-gradient(135deg, rgba(124, 58, 237, 0.4), rgba(16, 185, 129, 0.3))",
                  border: "1px solid rgba(124, 58, 237, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Dumbbell className="w-5 h-5 text-emerald" />
              </div>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-xl)", fontWeight: 800, color: "#fff" }}>
                GYM<span className="text-gradient">.FITNESS</span>
              </span>
            </Link>

            <p style={{ fontSize: "var(--text-sm)", maxWidth: "340px", marginBottom: "var(--space-6)" }}>
              India&apos;s fastest growing luxury fitness franchise. Empowering 50,000+
              athletes with elite strength facilities, recovery spas, and smart analytics.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <MapPin className="w-3.5 h-3.5 text-emerald" />
                <span>Headquarters: High Street Phoenix, Lower Parel, Mumbai</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Mail className="w-3.5 h-3.5 text-violet" />
                <span>support@gymfitness.app</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Phone className="w-3.5 h-3.5 text-emerald" />
                <span>+91 (022) 4001-0000 (24x7 Member Helpdesk)</span>
              </div>
            </div>

            {/* Social Icons Row using lucide-react */}
            <div className="footer-social-row">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn"
                aria-label="Subscribe on YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn"
                aria-label="Like us on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links-list">
              <li>
                <Link href="/" className="footer-link">Home</Link>
              </li>
              <li>
                <Link href="#features" className="footer-link">Amenities & Equipment</Link>
              </li>
              <li>
                <Link href="#plans" className="footer-link">Membership Plans</Link>
              </li>
              <li>
                <Link href="#locations" className="footer-link">All 25+ Gym Locations</Link>
              </li>
              <li>
                <Link href="#community" className="footer-link">Athlete Testimonials</Link>
              </li>
              <li>
                <Link href="/dashboard" className="footer-link">Member Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Programs & Facilities */}
          <div>
            <h4 className="footer-col-title">Club Facilities</h4>
            <ul className="footer-links-list">
              <li>
                <span className="footer-link">Olympic Barbell Rigs</span>
              </li>
              <li>
                <span className="footer-link">Cardio & HIIT Zone</span>
              </li>
              <li>
                <span className="footer-link">Cedarwood Saunas & Steam</span>
              </li>
              <li>
                <span className="footer-link">MMA Boxing Ring</span>
              </li>
              <li>
                <span className="footer-link">Personal Trainer Coaching</span>
              </li>
              <li>
                <span className="footer-link">Protein Shake & Smoothie Bar</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Franchise Hubs & Legal */}
          <div>
            <h4 className="footer-col-title">Key Hubs</h4>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginBottom: "var(--space-3)" }}>
              Locations across Mumbai, Delhi, Bengaluru, Pune, Hyderabad, Chennai, Ahmedabad, Kolkata, Gurugram, Jaipur, and Chandigarh.
            </p>
            <div style={{ marginTop: "var(--space-4)" }}>
              <Link href="/register" className="btn btn-secondary btn-sm btn-full" style={{ justifyContent: "center" }}>
                <span>Join As A Member</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div style={{ marginTop: "var(--space-4)", fontSize: "var(--text-xs)", display: "flex", flexDirection: "column", gap: "6px" }}>
              <Link href="/privacy" className="footer-link">Privacy Policy</Link>
              <Link href="/terms" className="footer-link">Terms of Membership</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div>
            © {currentYear} GYM Fitness India Ltd. All rights reserved.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span>Built with precision for peak physical performance</span>
            <Heart className="w-3.5 h-3.5 text-emerald" style={{ display: "inline" }} />
          </div>
        </div>
      </div>
    </footer>
  );
}
