"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, LogIn, UserPlus, AlertCircle, CheckCircle } from "lucide-react";

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" fill="none">
      <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
      <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
      <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
      <path d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 35.245 44 30 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
    </svg>
  );
}

type Mode = "login" | "signup";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  async function handleGoogle() {
    setGoogleLoading(true);
    setError(null);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    setGoogleLoading(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError("Neispravni email ili lozinka.");
      } else {
        router.push("/");
        router.refresh();
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Registracija uspješna! Provjerite email za potvrdu.");
      }
    }

    setLoading(false);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #1e1e2f 0%, #2d2550 60%, #1a1a3e 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-wider">
            <span
              style={{
                background: "linear-gradient(90deg, #a393f5, #6b5ce7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              DION
            </span>
            <span className="text-white">ICA</span>
          </h1>
          <p className="text-[#6e6a8a] text-sm mt-1">Zagreb Stock Exchange</p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-7 border border-[#3d3560]"
          style={{ background: "rgba(30,30,47,0.85)", backdropFilter: "blur(12px)" }}
        >
          {/* Tabs */}
          <div className="flex rounded-xl overflow-hidden border border-[#3d3560] mb-6">
            {(["login", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(null); setSuccess(null); }}
                className="flex-1 py-2.5 text-sm font-semibold transition-all"
                style={{
                  background: mode === m
                    ? "linear-gradient(90deg, #6b5ce7, #a393f5)"
                    : "transparent",
                  color: mode === m ? "#fff" : "#6e6a8a",
                }}
              >
                {m === "login" ? "Prijava" : "Registracija"}
              </button>
            ))}
          </div>

          {/* Error / Success */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 text-[#e04363] bg-[#e04363]/10 border border-[#e04363]/20 px-3 py-2.5 rounded-lg text-sm mb-4"
              >
                <AlertCircle size={15} />
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 text-[#0ea371] bg-[#0ea371]/10 border border-[#0ea371]/20 px-3 py-2.5 rounded-lg text-sm mb-4"
              >
                <CheckCircle size={15} />
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-[#6e6a8a] uppercase tracking-wider font-medium block mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6e6a8a]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="ime@email.com"
                  className="w-full bg-[#2d2550] border border-[#3d3560] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-[#4a4570] focus:outline-none focus:border-[#6b5ce7] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-[#6e6a8a] uppercase tracking-wider font-medium block mb-1.5">
                Lozinka
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6e6a8a]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full bg-[#2d2550] border border-[#3d3560] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-[#4a4570] focus:outline-none focus:border-[#6b5ce7] transition-colors"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 mt-2 disabled:opacity-60 transition-opacity"
              style={{ background: "linear-gradient(90deg, #6b5ce7, #a393f5)" }}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : mode === "login" ? (
                <><LogIn size={15} /> Prijavi se</>
              ) : (
                <><UserPlus size={15} /> Registriraj se</>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[#3d3560]" />
            <span className="text-xs text-[#4a4570]">ili</span>
            <div className="flex-1 h-px bg-[#3d3560]" />
          </div>

          {/* Google */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 border border-[#3d3560] hover:border-[#6b5ce7] hover:bg-[#6b5ce7]/10 transition-all disabled:opacity-60"
          >
            {googleLoading ? (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <><GoogleIcon /> Nastavi s Googleom</>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
