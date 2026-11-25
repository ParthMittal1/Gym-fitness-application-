import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "@/lib/db";

// ---------------------------------------------------------------------------
// Type augmentation — add `id` and `role` to the built-in Session / JWT types
// ---------------------------------------------------------------------------
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
    };
  }
  interface User {
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

// ---------------------------------------------------------------------------
// NextAuth configuration
// ---------------------------------------------------------------------------
export const authOptions: NextAuthOptions = {
  // ── Session strategy ──────────────────────────────────────────────────
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // ── JWT settings ──────────────────────────────────────────────────────
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },

  // ── Custom pages ──────────────────────────────────────────────────────
  pages: {
    signIn: "/login",
    error: "/login",   // redirect auth errors back to login with ?error=
  },

  // ── Providers ─────────────────────────────────────────────────────────
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials): Promise<User | null> {
        // 1. Basic presence check
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        // 2. Fetch user from DB
        const user = await db.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
          select: {
            id:       true,
            name:     true,
            email:    true,
            image:    true,
            role:     true,
            password: true,
          },
        });

        if (!user) {
          throw new Error("No account found with that email address.");
        }

        // 3. Reject OAuth-only accounts (no password set)
        if (!user.password) {
          throw new Error(
            "This account uses a social login. Please sign in with the provider you used."
          );
        }

        // 4. Compare hashed password
        const passwordMatch = await compare(credentials.password, user.password);
        if (!passwordMatch) {
          throw new Error("Incorrect password. Please try again.");
        }

        // 5. Return the user object NextAuth will embed in the JWT
        return {
          id:    user.id,
          name:  user.name,
          email: user.email,
          image: user.image,
          role:  user.role,
        };
      },
    }),
  ],

  // ── Callbacks ─────────────────────────────────────────────────────────
  callbacks: {
    /**
     * jwt callback — runs whenever a token is created or refreshed.
     * Embed id + role into the JWT on first sign-in (when `user` is present).
     */
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id;
        token.role = user.role;
      }
      return token;
    },

    /**
     * session callback — runs on every useSession() / getServerSession() call.
     * Surfaces id + role onto the session object so the client can read them.
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id   = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },

  // ── Secret ────────────────────────────────────────────────────────────
  secret: process.env.NEXTAUTH_SECRET,

  // ── Debug (dev only) ──────────────────────────────────────────────────
  debug: process.env.NODE_ENV === "development",
};
