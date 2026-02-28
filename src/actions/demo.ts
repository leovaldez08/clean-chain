"use server";

import { cookies } from "next/headers";

export async function setDemoMode(enabled: boolean) {
  const cookieStore = await cookies();
  cookieStore.set("cleanchain-demo-mode", enabled ? "true" : "false", {
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    sameSite: "lax",
  });
}

export async function getDemoMode(): Promise<boolean> {
  const cookieStore = await cookies();
  const demoCookie = cookieStore.get("cleanchain-demo-mode");

  if (demoCookie) {
    return demoCookie.value === "true";
  }

  // Fallback to static env if cookie is not set
  return process.env.NEXT_PUBLIC_DEMO_MODE === "true";
}
