"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import {
  Camera,
  MapPin,
  Shield,
  Zap,
  BarChart3,
  Clock,
  Users,
  Eye,
  ArrowRight,
  ChevronDown,
  Smartphone,
  Globe,
  CheckCircle2,
  Menu,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { Footer } from "@/components/footer"; // Added this import
import { useTranslations } from "next-intl";
import type { Incident } from "@/lib/types";
import { getRecentResolvedIncidents } from "@/actions/impact";

/* ── Animated floating particles for hero background ── */
function FloatingParticles() {
  const [particles, setParticles] = useState<
    {
      id: number;
      x: number;
      y: number;
      size: number;
      duration: number;
      delay: number;
      driftX: number;
    }[]
  >([]);

  useEffect(() => {
    Promise.resolve().then(() => {
      setParticles(
        Array.from({ length: 40 }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          duration: Math.random() * 20 + 15,
          delay: Math.random() * 5,
          driftX: Math.random() * 40 - 20,
        })),
      );
    });
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-emerald-400/20"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [0, -80, 0],
            x: [0, p.driftX, 0],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ── Animated grid lines ── */
function AnimatedGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Vertical lines */}
        {Array.from({ length: 12 }, (_, i) => (
          <motion.line
            key={`v-${i}`}
            x1={`${(i + 1) * 8}%`}
            y1="0%"
            x2={`${(i + 1) * 8}%`}
            y2="100%"
            stroke="rgba(52, 211, 153, 0.05)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, delay: i * 0.1, ease: "easeOut" }}
          />
        ))}
        {/* Horizontal lines */}
        {Array.from({ length: 8 }, (_, i) => (
          <motion.line
            key={`h-${i}`}
            x1="0%"
            y1={`${(i + 1) * 12}%`}
            x2="100%"
            y2={`${(i + 1) * 12}%`}
            stroke="rgba(52, 211, 153, 0.04)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.5, delay: i * 0.15, ease: "easeOut" }}
          />
        ))}
      </svg>

      {/* Glowing intersection dots */}
      {Array.from({ length: 6 }, (_, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400/40"
          style={{
            left: `${20 + i * 12}%`,
            top: `${30 + (i % 3) * 20}%`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 2, 1],
            boxShadow: [
              "0 0 0px rgba(52,211,153,0)",
              "0 0 15px rgba(52,211,153,0.5)",
              "0 0 0px rgba(52,211,153,0)",
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.6,
          }}
        />
      ))}
    </div>
  );
}

/* ── Floating orbs ── */
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large green orb */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)",
          top: "10%",
          left: "15%",
        }}
        animate={{
          x: [0, 60, -30, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Teal orb */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(20,184,166,0.1) 0%, transparent 70%)",
          bottom: "15%",
          right: "10%",
        }}
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 30, -50, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Small accent orb */}
      <motion.div
        className="absolute w-[200px] h-[200px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(52,211,153,0.15) 0%, transparent 70%)",
          top: "50%",
          right: "30%",
        }}
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -60, 30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* ── Scanning line effect ── */
function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent pointer-events-none"
      animate={{ top: ["0%", "100%"] }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ── Fade up variant ── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ── Hero Section ── */
function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const t = useTranslations("LandingPage");
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [typedText, setTypedText] = useState("");
  const fullText = t("title");
  // const fullText = "Clean streets. Clear accountability.";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 45);
    return () => clearInterval(interval);
  }, [fullText]);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-slate-50 dark:from-emerald-950 dark:via-slate-950 dark:to-slate-900" />
      <FloatingOrbs />
      <AnimatedGrid />
      <FloatingParticles />
      <ScanLine />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
      >
        {/* Live badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium text-sm mb-8 backdrop-blur-sm border-0 ring-0 shadow-none"
        >
          <motion.span
            className="w-2 h-2 rounded-full bg-emerald-500"
            animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          {t("liveInMadurai")}
        </motion.div>

        {/* Typed heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-[5rem] font-extrabold tracking-normal md:tracking-wide text-slate-900 dark:text-white leading-[1.35] sm:leading-[1.25] min-h-[2.5em] sm:min-h-[2.4em] text-balance mx-auto">
          {typedText.split(". ").map((part, idx) =>
            idx === 0 ? (
              <span key={idx}>
                {part}
                {typedText.includes(". ") ? "." : ""}
                <br />
              </span>
            ) : (
              <motion.span
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent"
              >
                {part}
              </motion.span>
            ),
          )}
          <motion.span
            className="inline-block w-[3px] h-[0.9em] bg-emerald-400 ml-1 align-middle"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="mt-6 sm:mt-8 text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-[1.8] tracking-wide px-4 dark:text-slate-400"
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.8 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4"
        >
          <Link
            href="/citizen"
            className="group w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:scale-[1.02] cursor-pointer"
          >
            <Camera className="w-5 h-5" />
            {t("startReporting")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/supervisor"
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white text-black hover:bg-gray-100 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 shadow-md ring-1 ring-black/5 dark:ring-white/10 font-semibold rounded-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
          >
            <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            {t("supervisorLogin")}
          </Link>
          <Link
            href="/admin"
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white text-black hover:bg-gray-100 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 shadow-md ring-1 ring-black/5 dark:ring-white/10 font-semibold rounded-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
          >
            <Eye className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            {t("adminDashboard")}
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-slate-500 tracking-widest uppercase">
          {t("scroll")}
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-5 h-5 text-slate-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ── Features ── */
function FeaturesSection() {
  const t = useTranslations("LandingPage");

  const translatedFeatures = [
    {
      icon: Camera,
      title: t("featureSnapTitle"),
      description: t("featureSnapDesc"),
      color: "emerald",
    },
    {
      icon: MapPin,
      title: t("featureGpsTitle"),
      description: t("featureGpsDesc"),
      color: "teal",
    },
    {
      icon: Shield,
      title: t("featureProximityTitle"),
      description: t("featureProximityDesc"),
      color: "cyan",
    },
    {
      icon: Zap,
      title: t("featureRealtimeTitle"),
      description: t("featureRealtimeDesc"),
      color: "green",
    },
    {
      icon: BarChart3,
      title: t("featureHeatmapTitle"),
      description: t("featureHeatmapDesc"),
      color: "emerald",
    },
    {
      icon: Clock,
      title: t("featureResponseTitle"),
      description: t("featureResponseDesc"),
      color: "teal",
    },
  ];

  return (
    <section
      id="features"
      className="py-20 sm:py-32 px-4 sm:px-6 bg-background relative overflow-hidden"
    >
      {/* Subtle background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="text-center mb-16 sm:mb-20"
        >
          <motion.p
            variants={fadeUp}
            custom={0}
            className="text-emerald-500 font-semibold text-sm tracking-widest uppercase mb-4"
          >
            {t("featuresSubtitle")}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="text-3xl sm:text-5xl font-bold tracking-normal md:tracking-wide text-foreground leading-[1.3]"
          >
            {t("featuresTitle")}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-4 text-muted-foreground text-base sm:text-lg max-w-xl mx-auto"
          >
            {t("featuresDesc")}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {translatedFeatures.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group relative p-6 sm:p-8 rounded-2xl border border-border bg-card hover:border-emerald-500/30 transition-all duration-500 hover:shadow-[0_0_60px_rgba(16,185,129,0.06)] cursor-pointer"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ── Workflow ── */
function WorkflowSection() {
  const t = useTranslations("LandingPage");

  const translatedSteps = [
    {
      step: "01",
      icon: Smartphone,
      role: t("flowStep1Role"),
      title: t("flowStep1Title"),
      description: t("flowStep1Desc"),
    },
    {
      step: "02",
      icon: Shield,
      role: t("flowStep2Role"),
      title: t("flowStep2Title"),
      description: t("flowStep2Desc"),
    },
    {
      step: "03",
      icon: BarChart3,
      role: t("flowStep3Role"),
      title: t("flowStep3Title"),
      description: t("flowStep3Desc"),
    },
  ];

  return (
    <section
      id="workflow"
      className="py-20 sm:py-32 px-4 sm:px-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-emerald-950/5 dark:via-emerald-950/10 to-background" />

      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="text-center mb-16 sm:mb-20"
        >
          <motion.p
            variants={fadeUp}
            custom={0}
            className="text-emerald-500 font-semibold text-sm tracking-widest uppercase mb-4"
          >
            {t("flowSubtitle")}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="text-3xl sm:text-5xl font-bold tracking-normal md:tracking-wide text-foreground leading-[1.3]"
          >
            {t("flowTitle")}
          </motion.h2>
        </motion.div>

        {/* Connecting line */}
        <div className="hidden sm:block absolute left-8 top-[220px] bottom-20 w-px bg-gradient-to-b from-emerald-500/20 via-emerald-500/10 to-transparent" />

        <div className="space-y-6 sm:space-y-8">
          {translatedSteps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.7,
                delay: i * 0.2,
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
              }}
              whileHover={{ scale: 1.01, x: 8 }}
              className="flex flex-col sm:flex-row items-start gap-4 sm:gap-8 p-6 sm:p-8 rounded-2xl border border-border bg-card/50 dark:bg-card/30 backdrop-blur-sm hover:border-emerald-500/20 transition-all duration-300"
            >
              <div className="flex-shrink-0 relative">
                <motion.div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                >
                  <step.icon className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-500" />
                </motion.div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg font-bold">
                    STEP {step.step}
                  </span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    {step.role}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Stats counter ── */
function AnimatedCounter({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const increment = target / 40;
          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 30);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

function StatsSection() {
  const t = useTranslations("LandingPage");
  const translatedStats = [
    { value: 100, label: t("statsCovered"), suffix: "" },
    { value: 75, label: t("statsGpsAcc"), suffix: "m" },
    { value: 3, label: t("statsRoles"), suffix: "" },
    { value: 0, label: t("statsLogin"), suffix: "" },
  ];

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 bg-emerald-500 relative overflow-hidden">
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
        animate={{ x: [0, 40], y: [0, 40] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8"
        >
          {translatedStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              custom={i}
              className="text-center"
            >
              <div className="text-3xl sm:text-5xl font-bold text-white">
                {stat.value === 0 ? (
                  "0"
                ) : (
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                )}
              </div>
              <div className="text-emerald-100 text-xs sm:text-sm mt-2">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ── CTA ── */
function CTASection() {
  const t = useTranslations("LandingPage");

  return (
    <section className="py-20 sm:py-32 px-4 sm:px-6 bg-background relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer}
        className="relative max-w-3xl mx-auto text-center px-4"
      >
        <motion.div variants={fadeUp} custom={0}>
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-6" />
          </motion.div>
        </motion.div>
        <motion.h2
          variants={fadeUp}
          custom={1}
          className="text-3xl sm:text-5xl font-bold tracking-normal md:tracking-wide leading-[1.3] text-foreground"
        >
          {t("ctaMainBold")}
          <br />
          <span className="text-emerald-500">{t("ctaMainColor")}</span>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          custom={2}
          className="mt-6 text-muted-foreground text-base sm:text-lg max-w-xl mx-auto"
        >
          {t("ctaDesc")}
        </motion.p>
        <motion.div variants={fadeUp} custom={3} className="mt-8 sm:mt-10">
          <Link
            href="/citizen"
            className="group inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-2xl text-base sm:text-lg transition-all duration-300 hover:shadow-[0_0_60px_rgba(16,185,129,0.3)] hover:scale-[1.03] cursor-pointer"
          >
            <Camera className="w-5 sm:w-6 h-5 sm:h-6" />
            {t("startReporting")}
            <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>

      <div className="mt-16 sm:mt-20 text-center">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>{t("pwa")}</span>
          </div>
          <span className="text-border hidden sm:block">|</span>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{t("rolesys")}</span>
          </div>
          <span className="text-border hidden sm:block">|</span>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{t("gpsver")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Impact Section ── */
function ImpactSection() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const t = useTranslations("LandingPage");

  useEffect(() => {
    async function load() {
      const { data } = await getRecentResolvedIncidents();
      if (data) setIncidents(data as Incident[]);
    }
    load();
  }, []);

  if (incidents.length === 0) return null;

  return (
    <section
      id="impact"
      className="py-20 sm:py-32 px-4 sm:px-6 bg-muted/20 relative overflow-hidden border-y border-border"
    >
      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.p
            variants={fadeUp}
            custom={0}
            className="text-emerald-500 font-semibold text-sm tracking-widest uppercase mb-4"
          >
            {t("impactSubtitle")}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="text-3xl sm:text-5xl font-bold tracking-normal md:tracking-wide text-foreground leading-[1.3]"
          >
            {t("impactTitle")}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-4 text-muted-foreground text-base sm:text-lg max-w-xl mx-auto"
          >
            {t("impactDesc")}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {incidents.map((inc, i) => (
            <motion.div
              key={inc.id}
              variants={fadeUp}
              custom={i}
              className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-lg hover:border-emerald-500/30 transition-all duration-300 group"
            >
              <div className="relative h-48 w-full border-b border-border flex">
                <div className="w-1/2 h-full relative border-r border-border/50 overflow-hidden">
                  <span className="absolute top-2 left-2 px-2 py-1 bg-black/60 text-white text-[10px] font-bold rounded shadow backdrop-blur-md z-10 w-fit">
                    Before
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={inc.photo_url}
                    alt="Before"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="w-1/2 h-full relative overflow-hidden">
                  <span className="absolute top-2 right-2 px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded shadow backdrop-blur-md z-10 w-fit">
                    After
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={inc.clearance_photo_url || undefined}
                    alt="After"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" /> Ward{" "}
                    {inc.ward_number || "City"}
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-500/10 px-2 py-1 rounded">
                    <Clock className="w-3.5 h-3.5" />{" "}
                    {inc.response_time_minutes}m response
                  </div>
                </div>
                <p className="text-sm font-medium text-foreground line-clamp-2 mt-2">
                  {inc.description ||
                    "Waste accumulation cleared from public area."}
                </p>
                <div className="mt-4 text-[10px] text-muted-foreground uppercase tracking-widest border-t border-border pt-4 text-center">
                  Resolved on{" "}
                  {inc.resolved_at
                    ? new Date(inc.resolved_at).toLocaleDateString()
                    : "—"}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ── Navbar ── */
const SCROLL_TRIGGER = 80;
const SCROLL_RELEASE = 50;

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const t = useTranslations("LandingPage");

  useMotionValueEvent(scrollY, "change", (y) => {
    setIsScrolled((prev) => {
      if (!prev && y > SCROLL_TRIGGER) return true;
      if (prev && y < SCROLL_RELEASE) return false;
      return prev;
    });
  });

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed top-4 md:top-6 w-full z-50 px-4 sm:px-6 pointer-events-none">
      <nav className="mx-auto max-w-7xl pointer-events-auto flex justify-center">
        {/* Floating Island */}
        <motion.div
          animate={{
            y: isScrolled ? -8 : 0,
            maxWidth: isScrolled ? 960 : 1024,
            borderRadius: isScrolled ? 9999 : 24,
          }}
          style={{
            backgroundColor: isScrolled
              ? "rgba(15, 23, 42, 0.55)"
              : "transparent",
            backdropFilter: isScrolled
              ? "saturate(180%) blur(24px)"
              : "blur(0px)",
            WebkitBackdropFilter: isScrolled
              ? "saturate(180%) blur(24px)"
              : "none",
            boxShadow: isScrolled
              ? "0 0.5px 0 0 rgba(255,255,255,0.08), 0 20px 50px -15px rgba(0,0,0,0.35)"
              : "none",
            transition: "padding 300ms ease-out, height 300ms ease-out",
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 35,
          }}
          className={`flex items-center justify-between w-full will-change-transform ${
            isScrolled
              ? "px-5 sm:px-8 h-14 border-none"
              : "px-4 sm:px-6 h-16 border-none"
          }`}
        >
          {/* Logo */}
          <div
            className="flex items-center gap-3 shrink-0 group cursor-pointer"
            onClick={() => scrollTo("hero")}
          >
            <motion.div
              animate={{ scale: isScrolled ? 0.9 : 1 }}
              transition={{ duration: 0.25 }}
              className="relative w-12 h-12 sm:w-11 sm:h-11 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/icons/icon-512.png"
                alt="CleanChain"
                className="w-full h-full object-contain"
              />
            </motion.div>
            <span className="font-extrabold text-xl tracking-tight hidden sm:block bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              CleanChain
            </span>
          </div>

          {/* Desktop Nav */}
          <div
            className={`hidden md:flex items-center transition-[gap,opacity] duration-300 ${
              isScrolled
                ? "gap-6 opacity-90 hover:opacity-100"
                : "gap-10 opacity-100"
            }`}
          >
            {[
              { label: t("navFeatures"), id: "features" },
              { label: t("navImpact"), id: "impact" },
              { label: t("navWorkflow"), id: "workflow" },
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="text-xs sm:text-sm font-bold uppercase tracking-wide transition-colors opacity-80 hover:opacity-100 text-slate-200 hover:text-white whitespace-nowrap"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Actions & Toggles */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <LanguageToggle />
            <ThemeToggle isScrolled={isScrolled} />

            {/* Mobile Menu Button */}
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-colors text-slate-200 bg-white/5 hover:bg-white/10"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="fixed top-24 left-4 right-4 md:hidden pointer-events-auto bg-background/95 backdrop-blur-2xl border border-border/50 shadow-2xl rounded-3xl p-6 flex flex-col gap-6"
        >
          <div className="flex flex-col gap-4">
            {[
              { label: t("navFeatures"), id: "features" },
              { label: t("navImpact"), id: "impact" },
              { label: t("navWorkflow"), id: "workflow" },
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="text-left font-bold text-lg text-foreground p-3 rounded-2xl hover:bg-muted transition-colors bg-foreground/5 border border-foreground/5"
              >
                {link.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  );
}

/* ── Main Page ── */
export default function LandingPage() {
  return (
    <main className="bg-background text-foreground relative overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <ImpactSection />
      <WorkflowSection />
      <CTASection />
      <Footer />
    </main>
  );
}
