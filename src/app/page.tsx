"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import {
  Camera,
  MapPin,
  Shield,
  Zap,
  BarChart3,
  Users,
  Truck,
  Eye,
  ArrowRight,
  ChevronDown,
  Smartphone,
  Globe,
  Clock,
  CheckCircle2,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-900" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live in Madurai
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[0.95]"
        >
          Clean streets.
          <br />
          <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
            Clear accountability.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-8 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          Ward-level waste accountability for Madurai. Citizens report. Drivers
          resolve. Admins monitor — all in real-time with GPS verification and
          photo evidence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/citizen"
            className="group flex items-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] cursor-pointer"
          >
            <Camera className="w-5 h-5" />
            Report an Incident
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/driver"
            className="flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold rounded-2xl transition-all duration-300 cursor-pointer"
          >
            <Truck className="w-5 h-5" />
            Driver Login
          </Link>
          <Link
            href="/admin"
            className="flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold rounded-2xl transition-all duration-300 cursor-pointer"
          >
            <Eye className="w-5 h-5" />
            Admin Dashboard
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ChevronDown className="w-6 h-6 text-slate-500" />
      </motion.div>
    </section>
  );
}

const features = [
  {
    icon: Camera,
    title: "Snap & Report",
    description:
      "Citizens photograph waste issues using their phone camera. GPS location is captured automatically.",
    color: "emerald",
  },
  {
    icon: MapPin,
    title: "GPS Verified",
    description:
      "Every report is geotagged and validated against the Madurai municipal boundary using PostGIS.",
    color: "teal",
  },
  {
    icon: Shield,
    title: "Geofence Enforced",
    description:
      "Drivers must be within 50m of the incident to submit clearance — no false resolutions.",
    color: "cyan",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description:
      "Admin dashboard updates instantly via Supabase Realtime. Zero page refreshes needed.",
    color: "emerald",
  },
  {
    icon: BarChart3,
    title: "Heatmap Analytics",
    description:
      "Identify waste hotspots across all 100 wards with interactive Leaflet heatmaps.",
    color: "teal",
  },
  {
    icon: Clock,
    title: "Response Tracking",
    description:
      "Automatic response time computation from report to resolution. Full accountability.",
    color: "cyan",
  },
];

function FeaturesSection() {
  return (
    <section className="py-32 px-6 bg-background relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-20"
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
            className="text-4xl sm:text-5xl font-bold tracking-tight"
          >
            Three roles. One mission.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto"
          >
            A complete waste accountability loop from citizen report to verified
            resolution.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              custom={i}
              className="group relative p-8 rounded-2xl border border-border bg-card hover:border-emerald-500/30 transition-all duration-500 hover:shadow-[0_0_60px_rgba(16,185,129,0.06)] cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-5">
                <feature.icon className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

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
    icon: Truck,
    role: "Driver",
    title: "Resolve at site",
    description:
      "Drivers see pending incidents on their dashboard. They must physically go to the spot and submit a clearance photo within 50m.",
  },
  {
    step: "03",
    icon: BarChart3,
    role: "Admin",
    title: "Monitor city-wide",
    description:
      "Admins see real-time updates, heatmaps, response times, and ward-level analytics. Before/after photos for transparency.",
  },
];

function WorkflowSection() {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-emerald-950/5 to-background" />

      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-20"
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
            className="text-4xl sm:text-5xl font-bold tracking-tight"
          >
            Report → Resolve → Monitor
          </motion.h2>
        </motion.div>

        <div className="space-y-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col md:flex-row items-start gap-8 p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm"
            >
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <step.icon className="w-8 h-8 text-emerald-500" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
                    STEP {step.step}
                  </span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    {step.role}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
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
    <section className="py-32 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-16"
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
            className="text-4xl sm:text-5xl font-bold tracking-tight"
          >
            Production-grade stack
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
        >
          {techStack.map((tech, i) => (
            <motion.div
              key={tech.name}
              variants={fadeUp}
              custom={i}
              className="p-6 rounded-2xl border border-border bg-card hover:border-emerald-500/30 transition-all duration-300 cursor-pointer"
            >
              <h3 className="font-semibold text-sm">{tech.name}</h3>
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

const stats = [
  { value: "100", label: "Wards Covered" },
  { value: "< 50m", label: "GPS Accuracy" },
  { value: "Real-time", label: "Live Updates" },
  { value: "0", label: "Login Required" },
];

function StatsSection() {
  return (
    <section className="py-20 px-6 bg-emerald-500">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              custom={i}
              className="text-center"
            >
              <div className="text-4xl sm:text-5xl font-bold text-white">
                {stat.value}
              </div>
              <div className="text-emerald-100 text-sm mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-32 px-6 bg-background relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="relative max-w-3xl mx-auto text-center"
      >
        <motion.div variants={fadeUp} custom={0}>
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-6" />
        </motion.div>
        <motion.h2
          variants={fadeUp}
          custom={1}
          className="text-4xl sm:text-5xl font-bold tracking-tight"
        >
          Every ward accountable.
          <br />
          <span className="text-emerald-500">Every incident tracked.</span>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          custom={2}
          className="mt-6 text-muted-foreground text-lg max-w-xl mx-auto"
        >
          CleanChain brings transparency to waste management in Madurai. Start
          reporting now — zero friction, maximum impact.
        </motion.p>
        <motion.div variants={fadeUp} custom={3} className="mt-10">
          <Link
            href="/citizen"
            className="inline-flex items-center gap-3 px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-2xl text-lg transition-all duration-300 hover:shadow-[0_0_60px_rgba(16,185,129,0.3)] cursor-pointer"
          >
            <Camera className="w-6 h-6" />
            Start Reporting
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </motion.div>

      <div className="mt-20 text-center">
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>PWA Installable</span>
          </div>
          <span className="text-border">|</span>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>3 Role System</span>
          </div>
          <span className="text-border">|</span>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>GPS Verified</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <main className="bg-background">
      <HeroSection />
      <FeaturesSection />
      <WorkflowSection />
      <StatsSection />
      <TechSection />
      <CTASection />
    </main>
  );
}
