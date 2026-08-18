"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Lock, Mail, ArrowRight, AlertCircle, Loader2, Sparkles } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setInfoMsg(null);

    try {
      if (isSignUpMode) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) {
          setErrorMsg(error.message);
        } else if (data.session) {
          router.push("/admin");
          router.refresh();
        } else {
          setInfoMsg("Registration submitted. If email verification is enabled, please check your inbox.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMsg(error.message);
        } else {
          router.push("/admin");
          router.refresh();
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected authentication error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden rc-carbon-grid">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[500px] h-96 sm:h-[500px] bg-[#FF5500]/15 blur-[140px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md bg-[#0D0D0D] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-black italic tracking-wider text-[#FF5500]">
                RC
              </span>
              <span className="text-3xl font-extrabold tracking-widest text-white">
                GADGETS
              </span>
            </div>
          </Link>

          <div>
            <h1 className="text-xl font-black uppercase text-white tracking-wide">
              {isSignUpMode ? "Create Admin Account" : "Admin Portal Login"}
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Secure access to manage live business website content
            </p>
          </div>
        </div>

        {/* Error / Info Alerts */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {infoMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{infoMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="admin@rcgadgets.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#141414] border border-white/10 focus:border-[#FF5500] focus:ring-1 focus:ring-[#FF5500] text-white text-sm outline-none transition-all"
              />
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#141414] border border-white/10 focus:border-[#FF5500] focus:ring-1 focus:ring-[#FF5500] text-white text-sm outline-none transition-all"
              />
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl font-black text-xs sm:text-sm tracking-wider uppercase text-white bg-gradient-to-r from-[#FF5500] to-[#E04400] hover:from-[#FF6A1A] hover:to-[#FF5500] shadow-lg shadow-[#FF5500]/30 hover:shadow-[#FF5500]/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>{isSignUpMode ? "Create Account" : "Access Dashboard"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="pt-2 border-t border-white/10 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUpMode(!isSignUpMode);
              setErrorMsg(null);
              setInfoMsg(null);
            }}
            className="text-xs text-zinc-400 hover:text-[#FF5500] transition-colors"
          >
            {isSignUpMode
              ? "Already have an account? Sign In"
              : "Need to create the first admin account? Sign Up"}
          </button>
        </div>

        {/* Back to public site */}
        <div className="text-center">
          <Link
            href="/"
            className="text-[11px] font-bold text-zinc-500 hover:text-zinc-300 uppercase tracking-wider"
          >
            ← Back to Public Website
          </Link>
        </div>

      </div>
    </div>
  );
}
