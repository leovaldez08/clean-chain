"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "./theme-provider";
import { useEffect, useState } from "react";

export function ThemeToggle({ isScrolled }: { isScrolled?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    Promise.resolve().then(() => setMounted(true));
  }, []);

  const baseClasses = isScrolled
    ? "bg-white/10 hover:bg-white/20 text-white ring-white/10"
    : "bg-slate-900/5 hover:bg-slate-900/10 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 ring-slate-900/5 dark:ring-white/5";

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all cursor-pointer backdrop-blur-md shadow-sm border-0 ring-1 ${baseClasses}`}
      aria-label="Toggle theme"
    >
      <div className="w-5 h-5 flex items-center justify-center">
        {!mounted ? (
          <div className="w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-600 animate-pulse" />
        ) : theme === "light" ? (
          <Moon className="w-4 h-4" />
        ) : (
          <Sun className="w-4 h-4" />
        )}
      </div>
    </button>
  );
}
