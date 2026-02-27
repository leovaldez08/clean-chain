"use client";

import { motion, useScroll, useTransform } from "framer-motion";
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
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

/* ── Animated floating particles for hero background ── */
function FloatingParticles() {
  const [particles] = useState(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
    })),
  );

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
            x: [0, Math.random() * 40 - 20, 0],
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
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [typedText, setTypedText] = useState("");
  const fullText = "Clean streets. Clear accountability.";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 45);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-900" />
      <FloatingOrbs />
      <AnimatedGrid />
      <FloatingParticles />
      <ScanLine />

      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
      >
        {/* Live badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-8 backdrop-blur-sm"
        >
          <motion.span
            className="w-2 h-2 rounded-full bg-emerald-500"
            animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          Live in Madurai
        </motion.div>

        {/* Typed heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold tracking-tight text-white leading-[0.95] min-h-[1.9em] sm:min-h-[2.1em]">
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
          className="mt-6 sm:mt-8 text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed px-4"
        >
          Ward-level waste accountability for Madurai. Citizens report.
          Supervisors resolve. Admins monitor — all in real-time with GPS
          verification and photo evidence.
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
            Report an Incident
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/supervisor"
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 font-semibold rounded-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer backdrop-blur-sm"
          >
            <Shield className="w-5 h-5" />
            Supervisor Login
          </Link>
          <Link
            href="/admin"
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 font-semibold rounded-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer backdrop-blur-sm"
          >
            <Eye className="w-5 h-5" />
            Admin Dashboard
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
          Scroll
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
const features = [
  {
    icon: Camera,
    title: "Snap & Report",
    description:
      "Citizens photograph waste issues with their phone. GPS coordinates are captured instantly.",
    color: "emerald",
  },
  {
    icon: MapPin,
    title: "GPS Verified",
    description:
      "Every report is geotagged within 15km Madurai geofence using PostGIS validation.",
    color: "teal",
  },
  {
    icon: Shield,
    title: "Proximity Enforced",
    description:
      "Supervisors must be within 100m of the incident location to submit clearance.",
    color: "cyan",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description:
      "Admin dashboard updates instantly via Supabase Realtime. Zero page refreshes.",
    color: "green",
  },
  {
    icon: BarChart3,
    title: "Heatmap Analytics",
    description:
      "Identify waste hotspots across all 100 wards with interactive Leaflet heatmaps.",
    color: "emerald",
  },
  {
    icon: Clock,
    title: "Response Tracking",
    description:
      "Automatic response time computation from report to resolution. Full accountability.",
    color: "teal",
  },
];

function FeaturesSection() {
  return (
    <section className="py-20 sm:py-32 px-4 sm:px-6 bg-background relative overflow-hidden">
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
            How It Works
          </motion.p>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground"
          >
            Three roles. One mission.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-4 text-muted-foreground text-base sm:text-lg max-w-xl mx-auto"
          >
            A complete waste accountability loop from citizen report to verified
            resolution.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {features.map((feature, i) => (
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
const steps = [
  {
    step: "01",
    icon: Smartphone,
    role: "Citizen",
    title: "Report waste",
    description:
      "Open the app, snap a photo, and submit. GPS and device info are captured automatically. No login required.",
  },
  {
    step: "02",
    icon: Shield,
    role: "Supervisor",
    title: "Resolve at site",
    description:
      "Supervisors see pending incidents. They must physically visit the spot and submit a clearance photo within 100m.",
  },
  {
    step: "03",
    icon: BarChart3,
    role: "Admin",
    title: "Monitor city-wide",
    description:
      "Admins see real-time updates, heatmaps, response times, and ward-level analytics with before/after photos.",
  },
];

function WorkflowSection() {
  return (
    <section className="py-20 sm:py-32 px-4 sm:px-6 relative overflow-hidden">
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
            The Flow
          </motion.p>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground"
          >
            Report → Resolve → Monitor
          </motion.h2>
        </motion.div>

        {/* Connecting line */}
        <div className="hidden sm:block absolute left-8 top-[220px] bottom-20 w-px bg-gradient-to-b from-emerald-500/20 via-emerald-500/10 to-transparent" />

        <div className="space-y-6 sm:space-y-8">
          {steps.map((step, i) => (
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

/* ── Tech Stack ── */
const techStack = [
  { name: "Next.js 14", description: "App Router + Server Actions" },
  { name: "Supabase", description: "Auth, Storage, Realtime, PostGIS" },
  { name: "Leaflet", description: "Maps + Heatmaps" },
  { name: "Tailwind CSS", description: "Utility-first styling" },
  { name: "shadcn/ui", description: "Accessible components" },
  { name: "Vercel", description: "Edge deployment" },
];

function TechSection() {
  return (
    <section className="py-20 sm:py-32 px-4 sm:px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.p
            variants={fadeUp}
            custom={0}
            className="text-emerald-500 font-semibold text-sm tracking-widest uppercase mb-4"
          >
            Built With
          </motion.p>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground"
          >
            Production-grade stack
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4"
        >
          {techStack.map((tech, i) => (
            <motion.div
              key={tech.name}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -4, scale: 1.03 }}
              className="p-5 sm:p-6 rounded-2xl border border-border bg-card hover:border-emerald-500/30 transition-all duration-300 cursor-pointer group"
            >
              <h3 className="font-semibold text-sm text-foreground group-hover:text-emerald-500 transition-colors">
                {tech.name}
              </h3>
              <p className="text-muted-foreground text-xs mt-1">
                {tech.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
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

const stats = [
  { value: 100, label: "Wards Covered", suffix: "" },
  { value: 50, label: "GPS Accuracy", suffix: "m" },
  { value: 3, label: "User Roles", suffix: "" },
  { value: 0, label: "Login Required", suffix: "" },
];

function StatsSection() {
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
          {stats.map((stat, i) => (
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
          className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground"
        >
          Every ward accountable.
          <br />
          <span className="text-emerald-500">Every incident tracked.</span>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          custom={2}
          className="mt-6 text-muted-foreground text-base sm:text-lg max-w-xl mx-auto"
        >
          CleanChain brings transparency to waste management in Madurai. Start
          reporting now — zero friction, maximum impact.
        </motion.p>
        <motion.div variants={fadeUp} custom={3} className="mt-8 sm:mt-10">
          <Link
            href="/citizen"
            className="group inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-2xl text-base sm:text-lg transition-all duration-300 hover:shadow-[0_0_60px_rgba(16,185,129,0.3)] hover:scale-[1.03] cursor-pointer"
          >
            <Camera className="w-5 sm:w-6 h-5 sm:h-6" />
            Start Reporting
            <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>

      <div className="mt-16 sm:mt-20 text-center">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>PWA Installable</span>
          </div>
          <span className="text-border hidden sm:block">|</span>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>3 Role System</span>
          </div>
          <span className="text-border hidden sm:block">|</span>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>GPS Verified</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Main Page ── */
export default function LandingPage() {
  return (
    <main className="bg-background text-foreground">
      <HeroSection />
      <FeaturesSection />
      <WorkflowSection />
      <StatsSection />
      <TechSection />
      <CTASection />
    </main>
  );
}
