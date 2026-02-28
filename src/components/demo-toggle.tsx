"use client";

import { useState, useEffect } from "react";
import { setDemoMode } from "@/actions/demo";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export function DemoToggle() {
  const [isDemo, setIsDemo] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read initial state strictly from cookie or fallback to localStorage if needed
    const cookieState = document.cookie
      .split("; ")
      .find((row) => row.startsWith("cleanchain-demo-mode="));

    const initialValue = cookieState
      ? cookieState.split("=")[1] === "true"
      : process.env.NEXT_PUBLIC_DEMO_MODE === "true";

    setTimeout(() => {
      setIsDemo(initialValue);
      setMounted(true);
    }, 0);
  }, []);

  const handleToggle = async (checked: boolean) => {
    setIsDemo(checked);
    await setDemoMode(checked);

    if (checked) {
      toast.success("Demo Mode Enabled", {
        description: "Geofences and rate limits are now bypassed globally.",
      });
    } else {
      toast.info("Demo Mode Disabled", {
        description: "Strict geofencing and rate limits are fully active.",
      });
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 shadow-sm w-fit transition-all hover:bg-white/80 dark:hover:bg-slate-900/80">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
        <Sparkles className="w-4 h-4" />
      </div>
      <div className="flex flex-col">
        <Label
          htmlFor="demo-mode"
          className="text-sm font-semibold cursor-pointer text-slate-800 dark:text-slate-200"
        >
          Demo Presentation Mode
        </Label>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Overrides geographical & rate limit restrictions
        </span>
      </div>
      <Switch
        id="demo-mode"
        checked={isDemo}
        onCheckedChange={handleToggle}
        className="ml-2 data-[state=checked]:bg-emerald-500"
      />
    </div>
  );
}
