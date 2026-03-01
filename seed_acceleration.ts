import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!supabaseKey) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedHistoricalData() {
  console.log("🚀 Seeding historical data for acceleration demo...");

  const ward = 12;
  const now = new Date();

  const incidents = [];

  // Day 7-4 (Low baseline): ~1-2 per day
  for (let i = 6; i >= 3; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const count = Math.floor(Math.random() * 2) + 1;
    for (let j = 0; j < count; j++) {
      incidents.push({
        ward_number: ward,
        status: "resolved",
        severity: "low",
        description: "Baseline historical report",
        latitude: 9.9252,
        longitude: 78.1198,
        reported_at: date.toISOString(),
        resolved_at: new Date(date.getTime() + 3600000).toISOString(),
        response_time_minutes: 60,
        photo_url: "https://picsum.photos/seed/hist1/400/300",
      });
    }
  }

  // Day 2: 3 reports (Beginning of spike)
  const day2 = new Date(now);
  day2.setDate(day2.getDate() - 2);
  for (let j = 0; j < 3; j++) {
    incidents.push({
      ward_number: ward,
      status: "pending",
      severity: "medium",
      description: "Emerging cluster detected",
      latitude: 9.9255,
      longitude: 78.119,
      reported_at: day2.toISOString(),
      photo_url: "https://picsum.photos/seed/spike1/400/300",
    });
  }

  // Day 1: 5 reports (Clear acceleration)
  const day1 = new Date(now);
  day1.setDate(day1.getDate() - 1);
  for (let j = 0; j < 5; j++) {
    incidents.push({
      ward_number: ward,
      status: "pending",
      severity: "high",
      description: "Rapid waste accumulation",
      latitude: 9.9258,
      longitude: 78.1185,
      reported_at: day1.toISOString(),
      photo_url: "https://picsum.photos/seed/spike2/400/300",
    });
  }

  // Today: 8 reports (Peak spike)
  for (let j = 0; j < 8; j++) {
    incidents.push({
      ward_number: ward,
      status: "pending",
      severity: "high",
      description: "Critical hotspot peak",
      latitude: 9.926,
      longitude: 78.118,
      reported_at: now.toISOString(),
      photo_url: "https://picsum.photos/seed/peak/400/300",
    });
  }

  const { error } = await supabase.from("incidents").insert(incidents);

  if (error) {
    console.error("❌ Error seeding data:", error);
  } else {
    console.log(
      "✅ Successfully seeded 20+ records for Ward 12 showing clear acceleration!",
    );
  }
}

seedHistoricalData();
