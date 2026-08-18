"use client";

import React, { useEffect, useState } from "react";
import { Menu, User, ShieldCheck, Database, Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onOpenMobileMenu?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  subtitle,
  onOpenMobileMenu,
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
    <header className="h-16 bg-[#0D0D0D] border-b border-white/10 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 text-zinc-400 hover:text-white lg:hidden rounded-lg bg-white/5"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-black uppercase text-white tracking-wide flex items-center gap-2">
            <span>{title}</span>
          </h1>
          {subtitle && (
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Status indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>CMS Connected</span>
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-2.5 bg-[#141414] border border-white/10 rounded-full px-3 py-1.5">
          <div className="w-6 h-6 rounded-full bg-[#FF5500]/20 text-[#FF5500] flex items-center justify-center font-bold text-xs">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-medium text-zinc-300 max-w-[140px] truncate">
            {userEmail || "Admin User"}
          </span>
        </div>
      </div>
    </header>
  );
};
