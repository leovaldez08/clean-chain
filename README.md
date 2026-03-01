<br/>
<div align="center">
  <img src="public/icons/icon-512.webp" alt="CleanChain Logo" width="120" />
  <h1 align="center">CleanChain</h1>
  <p align="center">
    <strong>Ward-level Waste Accountability & Predictive Intelligence Platform for Madurai</strong>
  </p>
</div>

---

## 🌍 The Problem

In rapidly growing metropolitan areas like Madurai, civic waste accumulation often goes unnoticed until it becomes a public health hazard. Traditional municipal ticketing systems are archaic, opaque, and discourage citizen participation due to a lack of feedback loops. Citizens report issues into a "black box," and supervisors lack data-driven insights to allocate sanitary workers efficiently.

Most systems are **purely reactive** — they respond only after complaints pile up.

---

## 💡 How CleanChain Solves It

CleanChain bridges the gap between citizens, sanitary workers, and municipal authorities through **radical transparency, hyperlocal accountability, and predictive intelligence**.

Instead of a hidden ticketing funnel, CleanChain operates as an open, real-time geographic ledger. Citizens snap photos of waste, pin exact GPS coordinates, and the incident immediately appears on a public map. Supervisors are instantly notified, and when the waste is cleared, a "Before/After" photo timeline is permanently recorded.

Beyond visibility, CleanChain introduces **Proactive Urban Sanitation Intelligence** — forecasting emerging waste hotspots before escalation.

### What makes it different from standard ticketing?

1. **No Black Boxes:** Every report is public. Citizens can see exactly how long a ward takes to resolve an issue.
2. **Proactive, Not Reactive:** 7-day trailing averages + statistical slope acceleration detect “Emerging Risk Zones” before they explode.
3. **Gamification & Engagement:** Citizens earn a "Clean Score" for accurate reporting, turning civic duty into a rewarding experience.
4. **Hyperlocal Leaderboards:** Wards are ranked based on Risk Score and Average Response Time, incentivizing municipal competitiveness.
5. **Frictionless Onboarding:** Anonymous sessions reduce the barrier to entry to near zero.
6. **Fraud & Spam Prevention:** Smart GPS geofencing, cooldown logic, and rate limiting ensure data integrity.

---

## 🎯 Impact Statement

**"Clean streets. Clear accountability. Predictive action."**

CleanChain shifts municipal waste management from reactive damage control to proactive, data-driven stewardship by turning every smartphone into a node for civic accountability — ensuring Madurai remains pristine for future generations.

Target Impact:

- ⏱ Reduce response times by up to 40%
- 📍 Identify recurring dumping zones before escalation
- 📊 Enable data-backed workforce allocation

---

## ✨ Key Features

### For Citizens (PWA Experience)

- 📸 **Geotagged Photo Evidence:** Capture and report waste precisely where you stand.
- 📱 **QR-Code Quick Reporting:** Scan ward-based QR codes for instant contextual reporting.
- 🌍 **Bilingual Interface:** Fully localized in English and Tamil (`next-intl`) for maximum accessibility.
- 🏆 **My Impact Dashboard:** Track your Clean Score, reports submitted, and resolution rates.
- 🔒 **Anonymous Reporting:** Zero-friction onboarding via ephemeral sessions.
- 📡 **Offline-Capable PWA:** Report waste even with unstable connectivity.
- ⏳ **Smart Rate-Limiting:** IP throttling and geofencing to prevent spam and malicious usage.

---

### For Supervisors

- 📋 **Live Incident Queue:** Real-time list of pending incidents within assigned wards.
- 📷 **Before & After Verifications:** Mandatory photographic proof of resolution.
- 📊 **Performance Metrics:** Track average response time and resolution percentages.
- 🗺️ **Ward-Level Heatmaps:** Geographic density visualization of active incidents.

---

### For Admins & Municipal Strategy Teams

🧠 **Predictive Hotspot Forecasting:**  
 Statistical trend acceleration (7-day sliding window + slope detection) flags Emerging Risk Zones.

🔥 **Automated Hotspot Detection:**  
 Clusters GPS reports within a 100m radius to detect recurring dumping points.

🗺️ **Dynamic Heatmaps:**  
 Real-time visual mapping of active and resolved incidents city-wide.

🏆 **Ward Leaderboards:**  
 Data-driven Clean Scores and Risk Rankings per ward.

📊 **Enterprise Analytics Dashboard:**  
 Metrics on response times, resolution rates, and trend forecasting.

📁 **CSV Strategic Exports:**  
 Export structured incident datasets for audits, compliance, or deep-dive analysis.

⚡ **Real-Time Monitoring:**  
 Supabase subscriptions stream live updates without refresh.

---

### Universal Platform Features

- 📱 **Native PWA Installation:** Add to home screen on Android/iOS.
- 🌓 **Dynamic Theming:** Seamless Dark & Light mode.
- ♿ **Accessible Design:** WCAG-compliant color ratios and aria-labels.
- 🔐 **Enterprise-Grade RLS Security:** Strict ward-based data isolation.

---

## 🛠️ Technical Architecture & Stack

CleanChain is built on a modern, edge-ready tech stack designed for high throughput, predictive analytics, and rapid iteration.

---

### Tech Stack

#### Frontend

- **Framework:** Next.js 15+ (App Router, Server Actions, React Compiler)
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Icons:** lucide-react
- **Localization:** next-intl

#### Backend & Infrastructure

- **Backend as a Service:** Supabase
  - PostgreSQL (Row Level Security)
  - Realtime Subscriptions (WebSockets)
  - Auth (Anonymous + Role-based sessions)
  - Storage (Optimized image hosting)
- **Maps:** react-leaflet + OpenStreetMap
- **PWA Engine:** @ducanh2912/next-pwa

---

### Architecture Highlights

1. **Edge-Ready Predictive Analytics**
   - Hotspot Detection
   - Ward Risk Scoring
   - Trend Acceleration (Slope over 7-day trailing window)  
     Executed directly via PostgreSQL Functions (`rpc`) and triggers to minimize serverless overhead.

2. **Geospatial Intelligence Layer**
   - Groups incidents within 100m radius
   - Detects recurring failure zones
   - Calculates density heatmaps

3. **Localized Routing (SEO-Optimized)**
   - i18n middleware routing (`/[locale]/...`)
   - Indexable English & Tamil pages

4. **Optimized Asset Delivery**
   - WebP-based image pipeline
   - Lightweight PWA initialization for 3G/4G environments

5. **Security by Design**
   - Strict Row Level Security policies
   - Supervisor-ward isolation
   - Payload validation at storage bucket level

---

## 🚀 Local Development Setup

Follow these steps to spin up the full CleanChain ecosystem locally.

---

### Prerequisites

- Node.js (v20+ recommended)
- Docker Desktop (for local Supabase)
- Supabase CLI (`npm install -g supabase`)

---

### 1. Clone the Repository

````bash
git clone https://github.com/leovaldez08/clean-chain.git
cd clean-chain

## 🚀 Local Development Setup

Follow these steps to spin up the full CleanChain ecosystem locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+)
- [Docker Desktop](https://www.docker.com/) (Required for running Supabase locally)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (`npm install -g supabase`)

### 1. Clone the Repository

```bash
git clone https://github.com/leovaldez08/clean-chain.git
cd clean-chain
````

### 2. Install Dependencies

```bash
npm i
```

### 3. Start Local Supabase

This will spin up the PostgreSQL database, Authentication server, and Storage instances locally.

```bash
supabase start
```

_Note the `API URL` and `anon key` outputted by the CLI._

### 4. Configure Environment Variables

Copy the template and fill in the credentials provided by the Supabase CLI:

```bash
cp .env.example .env.local
```

Update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key
DEMO_MODE=true # Bypasses the strict GPS Madras geofence for testing
```

### 5. Seed the Database (Optional)

Push the hackathon mock data to populate the leaderboards and maps instantly.

```bash
supabase db reset
```

### 6. Run the Next.js Dev Server

```bash
npm run dev
```

The application will now be running on [http://localhost:3000](http://localhost:3000).

---

## 🔐 Security & Best Practices

- **Row Level Security (RLS):** Stringent database policies ensuring citizens can only modify their own tickets, while Supervisors can only resolve tickets within their assigned wards.
- **Payload Validation:** Schema protections ensuring malicious file uploads are blocked at the Supabase bucket level.
- **Accessible Design:** Meets WCAG guidelines with sufficient color contrast ratios and aria-labels for map nodes.

---

<div align="center">
  <i>Built by Cryonyx Lab • For Madurai City Civic Innovation</i>
</div>
