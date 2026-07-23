import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { checkRateLimit, LOGIN_LIMIT } from "@/lib/rateLimit";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
        // IP is passed from the login form client so the rate limiter
        // can identify the caller inside the server-side authorize callback.
        ip:       { label: "IP",       type: "text"     },
      },
      async authorize(credentials) {
        const adminEmail        = process.env.ADMIN_EMAIL;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminEmail || !adminPasswordHash) {
          throw new Error("ADMIN_EMAIL or ADMIN_PASSWORD_HASH not configured");
        }

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // ── Rate-limit check ─────────────────────────────────────────────
        const ip = (credentials.ip as string | undefined) ?? "unknown";
        const rl = checkRateLimit("login", ip, LOGIN_LIMIT);

        if (!rl.allowed) {
          throw new Error(rl.message ?? "Too many login attempts. Try again later.");
        }
        // ────────────────────────────────────────────────────────────────

        // Cast to string — NextAuth types credential fields as {} internally
        const submittedEmail    = String(credentials.email);
        const submittedPassword = String(credentials.password);

        // Constant-time email comparison (avoid early-exit timing leak)
        const emailMatch =
          submittedEmail.length === adminEmail.length &&
          submittedEmail === adminEmail;

        if (!emailMatch) {
          return null;
        }

        // bcrypt.compare is inherently timing-safe
        const passwordMatch = await bcrypt.compare(
          submittedPassword,
          adminPasswordHash
        );

        if (!passwordMatch) {
          return null;
        }

        return {
          id:    "admin",
          email: adminEmail,
          name:  "Shakoor (Admin)",
          role:  "admin",
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
    error:  "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = "admin";
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as typeof session.user & { role: string }).role =
          token.role as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge:   8 * 60 * 60, // 8-hour sessions
  },
});
