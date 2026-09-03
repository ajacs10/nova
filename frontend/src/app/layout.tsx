import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://nova-mentalwellness.com"),
  title: {
    default: "NOVA psychology",
    template: "%s | NOVA",
  },
  icons: {
    icon: [
      { url: "/icons/nova-favicon.svg", type: "image/svg+xml" },
      { url: "/icons/nova-icon-16.svg", type: "image/svg+xml", sizes: "16x16" },
      { url: "/icons/nova-icon-32.svg", type: "image/svg+xml", sizes: "32x32" },
    ],
    apple: [{ url: "/icons/nova-icon-192.svg", type: "image/svg+xml", sizes: "192x192" }],
    shortcut: "/icons/nova-icon-32.svg",
  },
  description:
    "NOVA Recovery helps you track self-reported symptoms, activities, sleep, and daily functioning for conversations with healthcare professionals.",
  keywords: [
    "mental wellness",
    "well-being",
    "mental health",
    "AI",
    "privacy",
    "self-awareness",
    "routine",
    "check-in",
    "sleep tracker",
    "emotional health",
  ],
  authors: [{ name: "Ana Juliana Sobrinho" }],
  alternates: {
    canonical: "/",
    languages: {
      en: "/en",
      pt: "/pt",
    },
  },
  openGraph: {
    title: "NOVA — Mental Wellness Companion",
    description:
      "Track self-reported symptoms, activities, sleep, and daily functioning with a privacy-first recovery companion.",
    type: "website",
    locale: "en_US",
    url: "/",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" className={inter.variable} data-scroll-behavior="smooth">
      <body className="min-h-screen w-full flex flex-col antialiased" style={{ backgroundColor: "#060810" }}>{children}</body>
    </html>
  );
}
