"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { Languages } from "lucide-react";
import { motion } from "framer-motion";

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "ta" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleLanguage}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-sm font-medium backdrop-blur-md shadow-sm border-0 ring-1 bg-white/10 hover:bg-white/20 text-white ring-white/10`}
      aria-label="Toggle Language"
    >
      <Languages className="w-4 h-4 shrink-0" />
      <span className="uppercase text-center w-[42px] leading-none block">
        {locale === "en" ? "தமிழ்" : "EN"}
      </span>
    </motion.button>
  );
}
