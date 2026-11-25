import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// ---------------------------------------------------------------------------
// NextAuth catch-all API route handler
// App Router convention: export named GET and POST handlers
// ---------------------------------------------------------------------------
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
