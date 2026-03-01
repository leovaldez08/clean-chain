<br/>
<div align="center">
  <img src="public/icons/icon-512.webp" alt="CleanChain Logo" width="120" />
  <h1 align="center">CleanChain</h1>
  <p align="center">
    <strong>Ward-level Waste Accountability Platform for Madurai</strong>
  </p>
</div>

---

## 🌍 The Problem

In rapidly growing metropolitan areas like Madurai, civic waste accumulation often goes unnoticed until it becomes a public health hazard. Traditional municipal ticketing systems are archaic, opaque, and discourage citizen participation due to a lack of feedback loops. Citizens report issues into a "black box," and supervisors lack data-driven insights to allocate sanitary workers efficiently.

## 💡 How CleanChain Solves It

CleanChain bridges the gap between citizens, sanitary workers, and municipal authorities through **radical transparency and hyperlocal accountability**.

Instead of a hidden ticketing funnel, CleanChain operates as an open, real-time geographic ledge. Citizens snap photos of waste, pin the exact GPS coordinates, and the incident immediately appears on an open map. Supervisors are instantly notified, and when the waste is cleared, a "Before/After" photo timeline is permanently recorded on the blockchain-inspired public ledger.

### What makes it different from standard ticketing?

1. **No Black Boxes:** Every report is public. Citizens can see exactly how long a ward takes to resolve an issue.
2. **Gamification & Engagement:** Citizens earn a "Clean Score" for accurate reporting, turning civic duty into a rewarding experience.
3. **Hyperlocal Leaderboards:** Wards are ranked based on their "Risk Score" and "Average Response Time," naturally incentivizing municipal competitiveness.
4. **Frictionless Onboarding:** No mandatory lengthy sign-ups. Anonymous reporting leverages Supabase's anonymous sessions to reduce the barrier to entry to zero.

---

## 🎯 Impact Statement

**"Clean streets. Clear accountability."**
CleanChain shifts municipal waste management from reactive damage control to proactive, data-driven stewardship by turning every smartphone into a node for civic accountability, ensuring Madurai remains pristine for future generations.

---

## ✨ Key Features

### For Citizens

- 📸 **Geotagged Photo Evidence:** Capture and report waste precisely where you stand.
- 🌍 **Bilingual Interface:** Fully localized in English and Tamil (`next-intl`) for maximum accessibility in Tamil Nadu.
- 🏆 **My Impact Dashboard:** Track your personal Clean Score, total reports, and community impact.
- 🔒 **Anonymous Reporting:** Zero-friction onboarding via ephemeral anonymous sessions.
- ⏳ **Smart Rate-Limiting:** Built-in IP throttling and geolocation geofencing limits spam and ensures quality reports.

### For Supervisors & Admins

- 🗺️ **Live Incident Heatmaps:** Leaflet-powered geographic visualizations of active and cleared waste zones.
- 🚨 **Automated Hotspot Detection:** Triggers SQL algorithms to flag areas where waste is recurrently dumped.
- 📷 **Before & After Verifications:** Side-by-side photographic evidence of completed civic tasks.
- 📊 **Enterprise Analytics Dashboard:** Real-time metrics on response times, resolution rates, and active ward rankings.

### Universal

- 📱 **Native PWA Experience:** Installable directly to the home screen (Android/iOS) for offline-capable reporting.
- 🌓 **Dynamic Theming:** Seamless Dark and Light mode integrations.

---

## 🛠️ Technical Architecture & Stack

CleanChain is built on a modern, edge-ready tech stack designed for high throughput and rapid iteration.

### Tech Stack

- **Frontend:** [Next.js 15](https://nextjs.org/) (App Router, React Compiler)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/) for fluid animations
- **Backend as a Service:** [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage edge-network)
- **Maps:** `react-leaflet` & OpenStreetMap
- **Localization:** `next-intl`
- **PWA Engine:** `@ducanh2912/next-pwa`

### Architecture Highlights

1. **Edge-Ready Analytics:** Heavy computations like _Hotspot Detection_ and _Ward Risk Scoring_ are executed natively via PostgreSQL Functions (`rpc`) and Triggers directly on the database level, drastically reducing serverless function invocation times.
2. **Localized Routing:** Implements standard i18n middleware routing (`/[locale]/...`) allowing Google ranking for both English and Tamil search queries.
3. **Optimized Assets:** Transitioned Next.js standard `Image` pipelines and heavy PNGs completely to natively compressed WebP formats for instant 3G/4G PWA initialization.

---

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
```

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
