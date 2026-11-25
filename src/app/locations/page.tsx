import React, { Suspense } from "react";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LocationsExplorer } from "@/components/LocationsExplorer";
import { MapPin, Sparkles, Building2, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Gym Locations & Clubs Across India | GYM Fitness",
  description:
    "Explore 25+ luxury GYM Fitness athletic clubs across Mumbai, Delhi, Bengaluru, Pune, Hyderabad, and more with sauna, Olympic rigs, and valet parking.",
};

async function LocationsData() {
  const locations = await db.gymLocation.findMany({
    where: { active: true },
    orderBy: [{ state: "asc" }, { city: "asc" }],
  });

  return <LocationsExplorer locations={locations} />;
}

function LocationsLoadingSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div className="card skeleton" style={{ minHeight: "140px" }} />
      <div className="grid grid-cols-3" style={{ gap: "var(--space-6)" }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card skeleton" style={{ minHeight: "300px" }} />
        ))}
      </div>
    </div>
  );
}

export default function LocationsPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1, paddingBlock: "var(--space-12) var(--space-20)" }}>
        <div className="container">
          {/* Header */}
          <div style={{ textAlign: "center", maxWidth: "760px", margin: "0 auto var(--space-12)" }}>
            <div className="badge badge-emerald" style={{ marginBottom: "var(--space-3)" }}>
              <MapPin className="w-3.5 h-3.5" />
              <span>NATIONWIDE FOOTPRINT</span>
            </div>
            <h1 style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)", marginBottom: "var(--space-4)" }}>
              Find Your Nearest <span className="text-gradient">Athletic Club</span>
            </h1>
            <p style={{ fontSize: "var(--text-lg)", color: "var(--text-secondary)" }}>
              Single card biometric access across 25+ premier facilities in major Indian
              metros. Olympic lifting platforms, Finnish saunas, and 24/7 access at select clubs.
            </p>
          </div>

          {/* Filterable Locations Explorer Component */}
          <Suspense fallback={<LocationsLoadingSkeleton />}>
            <LocationsData />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
