"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Zap, Lock, Mail, AlertCircle, ShieldAlert, Clock } from "lucide-react";
import { BUSINESS_NAME } from "@/lib/constants";

const MAX_VISIBLE_ATTEMPTS = 5;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin/dashboard";
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [lockedUntil, setLockedUntil]   = useState<number | null>(null);
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for lockout display
  useEffect(() => {
    if (!lockedUntil) return;
    const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
    if (remaining <= 0) {
      setLockedUntil(null);
      setError("");
      return;
    }
    setCountdown(remaining);
    const interval = setInterval(() => {
      const secs = Math.ceil((lockedUntil - Date.now()) / 1000);
      if (secs <= 0) {
        clearInterval(interval);
        setLockedUntil(null);
        setCountdown(0);
        setError("");
      } else {
        setCountdown(secs);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockedUntil]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockedUntil && Date.now() < lockedUntil) return;

    setError("");
    setLoading(true);

    try {
      // Pass the client IP via the credentials object so the server-side
      // rate limiter can identify the caller. We use a fallback of "client"
      // since browser JS cannot read the true server-side IP — the actual
      // IP extraction happens server-side via x-forwarded-for headers.
      const res = await signIn("credentials", {
        email,
        password,
        ip: "browser", // server reads real IP from x-forwarded-for
        redirect: false,
      });

      if (res?.error) {
        // Parse lockout message from NextAuth error string
        const msg: string = res.error ?? "";
        const lockoutMatch = msg.match(/locked for (\d+) minute/i);
        const tooManyMatch = msg.match(/Try again in (\d+) minute/i);

        if (lockoutMatch || tooManyMatch) {
          const mins = parseInt((lockoutMatch ?? tooManyMatch)![1], 10);
          setLockedUntil(Date.now() + mins * 60 * 1000);
          setAttemptsLeft(0);
          setError(msg.replace("CredentialsSignin", "").trim() || "Account temporarily locked.");
        } else {
          // Regular wrong password — decrement attempts counter
          setAttemptsLeft((prev) => {
            const next = prev === null ? MAX_VISIBLE_ATTEMPTS - 1 : prev - 1;
            return next;
          });
          setError("Invalid email or password.");
        }
      } else {
        // Redirect to the originally requested page, or dashboard
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isLocked = lockedUntil !== null && Date.now() < lockedUntil;
  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-[#F7F5EF]">
      <div className="max-w-md w-full bg-white rounded-lg p-8 md:p-10 border border-navy shadow-none">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-navy rounded-xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-amber" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-black text-navy font-display">
            {BUSINESS_NAME} Admin
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            Restricted access — authorised personnel only
          </p>
        </div>

        {/* Lockout banner */}
        {isLocked && (
          <div className="mb-6 p-4 bg-red-50 border border-muted-coral/40 rounded-lg text-muted-coral text-xs flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Access temporarily blocked</p>
              <p className="mt-0.5 flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3" />
                {mins > 0 ? `${mins}m ` : ""}{String(secs).padStart(2, "0")}s remaining
              </p>
            </div>
          </div>
        )}

        {/* Regular error */}
        {error && !isLocked && (
          <div className="mb-6 p-4 bg-red-50 border border-muted-coral/30 rounded-lg text-muted-coral text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <div>
              <span>{error}</span>
              {attemptsLeft !== null && attemptsLeft > 0 && (
                <span className="block mt-0.5 font-mono font-bold">
                  {attemptsLeft} attempt{attemptsLeft !== 1 ? "s" : ""} remaining before lockout
                </span>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLocked}
                autoComplete="username"
                placeholder="admin@example.com"
                className="w-full pl-10 pr-4 py-3 border border-navy/20 rounded-lg text-sm focus:ring-1 focus:ring-navy focus:border-navy focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLocked}
                autoComplete="current-password"
                className="w-full pl-10 pr-4 py-3 border border-navy/20 rounded-lg text-sm focus:ring-1 focus:ring-navy focus:border-navy focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || isLocked}
            className="w-full py-3.5 bg-navy hover:bg-navy-light text-white font-bold rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Verifying…" : isLocked ? "Account Locked" : "Sign In"}
          </button>
        </form>

        <p className="text-[10px] text-gray-400 text-center mt-5">
          5 failed attempts will lock this page for 15 minutes.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F5EF] flex items-center justify-center"><div className="text-navy text-sm">Loading...</div></div>}>
      <LoginForm />
    </Suspense>
  );
}
