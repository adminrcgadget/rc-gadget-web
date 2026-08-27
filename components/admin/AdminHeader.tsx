"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { User, ExternalLink, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onOpenMobileMenu?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  subtitle,
}) => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    };
    fetchUser();
  }, [supabase]);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200/80">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {title}
          </h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live</span>
          </span>
        </div>
        {subtitle && (
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="px-4 py-2 rounded-xl text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:border-[#FF5A00]/50 hover:text-[#FF5A00] transition-all shadow-xs flex items-center gap-2"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>View Store</span>
        </Link>

        {/* User Pill */}
        <div className="flex items-center gap-2.5 bg-white border border-gray-200/80 rounded-xl px-3.5 py-2 shadow-xs">
          <div className="w-6 h-6 rounded-lg bg-orange-50 text-[#FF5A00] flex items-center justify-center font-bold text-xs">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold text-gray-800 max-w-[150px] truncate">
            {userEmail || "Admin"}
          </span>
        </div>
      </div>
    </div>
  );
};
