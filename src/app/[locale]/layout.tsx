import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans_Tamil } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ServiceWorkerRegistrar } from "@/components/sw-registrar";
import { PwaInstallPrompt } from "@/components/pwa-install-prompt";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansTamil = Noto_Sans_Tamil({
  variable: "--font-sans",
  subsets: ["tamil", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "CleanChain",
  description:
    "Ward-level waste accountability platform for Madurai. Report, track, and resolve civic waste incidents in real-time.",
  manifest: "/manifest.json",
  metadataBase: new URL("https://cleanchain.vercel.app"),
  openGraph: {
    title: "CleanChain - Clean streets. Clear accountability.",
    description:
      "Real-time civic waste tracking for Madurai. Snap a photo, pin the location, and hold your ward accountable.",
    siteName: "CleanChain",
    type: "website",
    images: [
      {
        url: "/icons/icon-512.png",
        width: 512,
        height: 512,
        alt: "CleanChain Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Clean Chain",
    description:
      "Report waste. Track cleanup. Hold wards accountable. All from your phone.",
    images: ["/icons/icon-512.png"],
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CleanChain",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#10b981",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "ta")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansTamil.variable} font-sans antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>{children}</ThemeProvider>
        </NextIntlClientProvider>
        <ServiceWorkerRegistrar />
        <PwaInstallPrompt />
        <Toaster
          position="top-center"
          richColors
          closeButton
          toastOptions={{
            duration: 4000,
          }}
        />
      </body>
    </html>
  );
}
