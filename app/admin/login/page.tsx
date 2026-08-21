"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || "Invalid login credentials.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected authentication error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[500px] h-96 sm:h-[500px] bg-[#FF5A00]/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md bg-[#0A0A0A] border border-zinc-800/90 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <Link href="/" className="inline-block group">
            <div className="relative h-10 w-44 sm:h-12 sm:w-52">
              <Image
                src="/logo/Screenshot 2026-08-18 121555.png"
                alt="RC GADGETS"
                fill
                sizes="220px"
                className="object-contain"
                priority
              />
            </div>
          </Link>

          <div>
            <h1 className="text-lg font-black uppercase text-white tracking-wider">
              Admin Portal Login
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Secure access to manage live business website content
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
              Admin Email / Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="admin@rcgadgets"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#141414] border border-zinc-800 focus:border-[#FF5A00] focus:ring-1 focus:ring-[#FF5A00] text-white text-sm outline-none transition-all"
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
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#141414] border border-zinc-800 focus:border-[#FF5A00] focus:ring-1 focus:ring-[#FF5A00] text-white text-sm outline-none transition-all"
              />
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl font-black text-xs sm:text-sm tracking-wider uppercase text-white bg-[#FF5A00] hover:bg-[#FF6A00] shadow-lg shadow-[#FF5A00]/25 hover:shadow-[#FF5A00]/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Access Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Back to public site */}
        <div className="text-center pt-2">
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
