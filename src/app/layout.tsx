import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "./globals.css";

/* ─── Font Setup ─────────────────────────────────────────────────────────────
   Inter  → body / UI text
   Outfit → headings / display text                                            */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

/* ─── Viewport ───────────────────────────────────────────────────────────── */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#0a0a0f" },
    { media: "(prefers-color-scheme: light)", color: "#0a0a0f" },
  ],
};

/* ─── SEO Metadata ───────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  /* Basics */
  title: {
    default: "GYM Fitness — Train Smarter. Live Stronger.",
    template: "%s | GYM Fitness",
  },
  description:
    "GYM Fitness is your all-in-one performance platform — track workouts, monitor nutrition, manage memberships, and unlock data-driven coaching to achieve peak results.",
  keywords: [
    "gym fitness",
    "workout tracker",
    "fitness app",
    "gym management",
    "personal training",
    "nutrition tracking",
    "membership management",
    "strength training",
    "HIIT workouts",
  ],
  authors: [{ name: "GYM Fitness Team" }],
  creator: "GYM Fitness",
  publisher: "GYM Fitness",
  applicationName: "GYM Fitness",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  category: "fitness",

  /* Canonical */
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://gymfitness.app"
  ),
  alternates: {
    canonical: "/",
  },

  /* Open Graph */
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "GYM Fitness",
    title: "GYM Fitness — Train Smarter. Live Stronger.",
    description:
      "Track workouts, manage memberships, and unlock data-driven coaching with GYM Fitness.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GYM Fitness — Train Smarter. Live Stronger.",
        type: "image/png",
      },
    ],
  },

  /* Twitter / X */
  twitter: {
    card: "summary_large_image",
    title: "GYM Fitness — Train Smarter. Live Stronger.",
    description:
      "Track workouts, manage memberships, and unlock data-driven coaching with GYM Fitness.",
    images: ["/og-image.png"],
    creator: "@gymfitness",
    site: "@gymfitness",
  },

  /* Icons */
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg",    type: "image/svg+xml" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },

  /* Manifest */
  manifest: "/site.webmanifest",

  /* Robots */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  /* Verification (fill in when ready) */
  verification: {
    // google: "your-google-verification-code",
  },
};

/* ─── Root Layout ────────────────────────────────────────────────────────── */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* DNS prefetch for external origins */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {/* Skip to main content — accessibility */}
        <a
          href="#main-content"
          className="visually-hidden"
          style={{
            position: "absolute",
            top: "var(--space-4)",
            left: "var(--space-4)",
            zIndex: "var(--z-toast)",
            padding: "var(--space-3) var(--space-5)",
            background: "var(--accent-primary)",
            color: "#fff",
            borderRadius: "var(--radius-md)",
            fontWeight: 600,
          }}
        >
          Skip to main content
        </a>

        <AuthProvider>
          <main id="main-content">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
