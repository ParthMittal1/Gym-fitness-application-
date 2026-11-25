import React, { Suspense } from "react";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ProgressTrackerClient } from "./ProgressTrackerClient";

export const metadata: Metadata = {
  title: "Progress Tracker & Body Metrics | GYM Fitness",
  description: "Track body weight trends, body fat percentages, and physical measurements.",
};

async function ProgressTrackerContent() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard/progress");
  }

  const entries = await db.progressEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "asc" },
  });

  const serializedEntries = entries.map((entry) => ({
    ...entry,
    date: entry.date.toISOString(),
  }));

  return <ProgressTrackerClient initialEntries={serializedEntries} />;
}

function ProgressTrackerSkeleton() {
  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
      <div className="skeleton" style={{ height: "60px", marginBottom: "var(--space-6)", borderRadius: "var(--radius-lg)" }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-4)", marginBottom: "var(--space-8)" }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton" style={{ height: "90px", borderRadius: "var(--radius-xl)" }} />
        ))}
      </div>
      <div className="skeleton" style={{ height: "380px", borderRadius: "var(--radius-2xl)", marginBottom: "var(--space-8)" }} />
      <div className="skeleton" style={{ height: "260px", borderRadius: "var(--radius-2xl)" }} />
    </div>
  );
}

export default function ProgressPage() {
  return (
    <Suspense fallback={<ProgressTrackerSkeleton />}>
      <ProgressTrackerContent />
    </Suspense>
  );
}
