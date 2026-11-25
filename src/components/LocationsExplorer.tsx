"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  MapPin,
  Search,
  Phone,
  Mail,
  Clock,
  Star,
  Check,
  Building2,
  Navigation,
  Sparkles,
  ArrowRight,
  Filter,
} from "lucide-react";

export interface GymLocationItem {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  phone: string | null;
  email: string | null;
  lat: number | null;
  lng: number | null;
  amenities: string | null;
  timings: string | null;
  rating: number | null;
  active: boolean;
  imageUrl: string | null;
}

export function LocationsExplorer({
  locations,
}: {
  locations: GymLocationItem[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("ALL");
  const [selectedAmenity, setSelectedAmenity] = useState("ALL");

  // Extract unique cities
  const cities = useMemo(() => {
    const list = Array.from(new Set(locations.map((l) => l.city))).sort();
    return ["ALL", ...list];
  }, [locations]);

  // Extract unique amenities
  const allAmenities = useMemo(() => {
    const set = new Set<string>();
    locations.forEach((l) => {
      if (l.amenities) {
        try {
          const parsed = JSON.parse(l.amenities);
          if (Array.isArray(parsed)) {
            parsed.forEach((a) => set.add(a));
          }
        } catch {
          // ignore
        }
      }
    });
    return ["ALL", ...Array.from(set).sort()];
  }, [locations]);

  // Filtered locations
  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      // Search term matches name, address, city, or state
      const search = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !search ||
        loc.name.toLowerCase().includes(search) ||
        loc.address.toLowerCase().includes(search) ||
        loc.city.toLowerCase().includes(search) ||
        loc.state.toLowerCase().includes(search);

      // City filter
      const matchesCity = selectedCity === "ALL" || loc.city === selectedCity;

      // Amenity filter
      let matchesAmenity = true;
      if (selectedAmenity !== "ALL") {
        try {
          const parsed = loc.amenities ? JSON.parse(loc.amenities) : [];
          matchesAmenity = Array.isArray(parsed) && parsed.includes(selectedAmenity);
        } catch {
          matchesAmenity = false;
        }
      }

      return matchesSearch && matchesCity && matchesAmenity;
    });
  }, [locations, searchTerm, selectedCity, selectedAmenity]);

  return (
    <div>
      {/* ── Filter Controls Bar ────────────────────────────────────────────── */}
      <div
        className="card"
        style={{
          padding: "var(--space-6)",
          marginBottom: "var(--space-10)",
          background: "rgba(18, 19, 32, 0.8)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          {/* Top row: Search input */}
          <div className="input-wrapper" style={{ width: "100%" }}>
            <Search className="input-icon w-4 h-4" />
            <input
              type="text"
              placeholder="Search by city, state, street address, or club name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="auth-input"
              style={{ paddingLeft: "2.8rem" }}
            />
          </div>

          {/* Bottom row: City selector & Amenity selector */}
          <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Filter className="w-4 h-4 text-violet" />
              <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)" }}>
                Filters:
              </span>
            </div>

            {/* City Dropdown */}
            <div style={{ flex: 1, minWidth: "160px" }}>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="input"
                style={{ padding: "0.55rem var(--space-3)", fontSize: "var(--text-xs)" }}
              >
                <option value="ALL">All Cities ({locations.length} Clubs)</option>
                {cities.filter((c) => c !== "ALL").map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Amenity Dropdown */}
            <div style={{ flex: 1, minWidth: "160px" }}>
              <select
                value={selectedAmenity}
                onChange={(e) => setSelectedAmenity(e.target.value)}
                className="input"
                style={{ padding: "0.55rem var(--space-3)", fontSize: "var(--text-xs)" }}
              >
                <option value="ALL">All Amenities</option>
                {allAmenities.filter((a) => a !== "ALL").map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            {(searchTerm || selectedCity !== "ALL" || selectedAmenity !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCity("ALL");
                  setSelectedAmenity("ALL");
                }}
                className="btn btn-ghost btn-sm"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Results Count ──────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-6)",
        }}
      >
        <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
          Showing{" "}
          <strong style={{ color: "#fff" }}>{filteredLocations.length}</strong> of{" "}
          {locations.length} Athletic Clubs across India
        </span>

        {selectedCity !== "ALL" && (
          <span className="badge badge-emerald" style={{ fontSize: "0.75rem" }}>
            City: {selectedCity}
          </span>
        )}
      </div>

      {/* ── Locations Grid ─────────────────────────────────────────────────── */}
      {filteredLocations.length === 0 ? (
        <div className="card" style={{ padding: "var(--space-16) var(--space-8)", textAlign: "center" }}>
          <MapPin className="w-8 h-8 text-violet" style={{ margin: "0 auto var(--space-4)" }} />
          <h3 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-2)" }}>
            No Gyms Found Matching Your Query
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", maxWidth: "400px", margin: "0 auto var(--space-6)" }}>
            Try clearing your search term or selecting a different city or amenity filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setSelectedCity("ALL");
              setSelectedAmenity("ALL");
            }}
            className="btn btn-primary btn-sm"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3" style={{ gap: "var(--space-6)" }}>
          {filteredLocations.map((loc) => {
            let amenitiesList: string[] = [];
            if (loc.amenities) {
              try {
                amenitiesList = JSON.parse(loc.amenities);
              } catch {
                amenitiesList = [];
              }
            }

            return (
              <div
                key={loc.id}
                className="card-glow"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "var(--space-6)",
                }}
              >
                <div>
                  {/* City & Rating Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "var(--space-3)",
                    }}
                  >
                    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                      <span className="badge badge-emerald" style={{ fontSize: "0.7rem" }}>
                        {loc.city}
                      </span>
                      <span className="badge badge-muted" style={{ fontSize: "0.65rem" }}>
                        {loc.state}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Star className="w-3.5 h-3.5 text-amber" style={{ fill: "currentColor" }} />
                      <span style={{ fontSize: "var(--text-xs)", fontWeight: 700 }}>
                        {loc.rating || "4.8"}
                      </span>
                    </div>
                  </div>

                  {/* Club Name */}
                  <h3 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-2)" }}>
                    {loc.name}
                  </h3>

                  {/* Address */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "8px",
                      fontSize: "var(--text-xs)",
                      color: "var(--text-secondary)",
                      marginBottom: "var(--space-4)",
                    }}
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span>{loc.address}</span>
                  </div>

                  {/* Timings */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "var(--text-xs)",
                      color: "var(--text-muted)",
                      marginBottom: "var(--space-4)",
                    }}
                  >
                    <Clock className="w-3.5 h-3.5 text-violet" style={{ flexShrink: 0 }} />
                    <span>{loc.timings || "Mon-Sun 5:00 AM - 11:00 PM"}</span>
                  </div>

                  {/* Contact Phone & Email */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      fontSize: "var(--text-xs)",
                      padding: "var(--space-3)",
                      background: "rgba(255, 255, 255, 0.02)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-subtle)",
                      marginBottom: "var(--space-4)",
                    }}
                  >
                    {loc.phone && (
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Phone className="w-3 h-3 text-emerald" />
                        <a href={`tel:${loc.phone}`} style={{ color: "var(--text-secondary)" }}>
                          {loc.phone}
                        </a>
                      </div>
                    )}
                    {loc.email && (
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Mail className="w-3 h-3 text-violet" />
                        <a href={`mailto:${loc.email}`} style={{ color: "var(--text-secondary)" }}>
                          {loc.email}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Amenities List */}
                  {amenitiesList.length > 0 && (
                    <div style={{ marginBottom: "var(--space-5)" }}>
                      <div
                        style={{
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          color: "var(--text-muted)",
                          marginBottom: "6px",
                          letterSpacing: "0.08em",
                        }}
                      >
                        CLUB AMENITIES
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                        {amenitiesList.map((a, i) => (
                          <span key={i} className="location-amenity-pill">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer: Action button */}
                <div style={{ paddingTop: "var(--space-4)", borderTop: "1px solid var(--border-subtle)" }}>
                  <Link
                    href="/register"
                    className="btn btn-secondary btn-sm btn-full"
                    style={{ justifyContent: "center" }}
                  >
                    <span>Claim 1-Day Pass</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
