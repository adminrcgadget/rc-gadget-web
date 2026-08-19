import type { Metadata } from "next";
import { Montserrat, Orbitron } from "next/font/google";
import { getSiteSettings } from "@/lib/queries/site";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: `${settings.business_name} | ${settings.tagline || "Your World of Remote Control"}`,
    description: settings.description || "The ultimate destination for premium RC cars, planes, ships, excavators, and high-performance tracks in Kottakkal, Kerala.",
    keywords: ["RC Gadgets", "RC Cars Kerala", "RC Planes Kottakkal", "Remote Control Hobby Malappuram", "RC Adventure Track"],
    icons: {
      icon: settings.favicon_url || "/logo/Screenshot 2026-08-18 121555.png",
      shortcut: settings.favicon_url || "/logo/Screenshot 2026-08-18 121555.png",
      apple: settings.favicon_url || "/logo/Screenshot 2026-08-18 121555.png",
    },
    openGraph: {
      title: `${settings.business_name} — ${settings.tagline || "Your World of Remote Control"}`,
      description: settings.description || "Where passion meets performance. Discover high-end RC models and racing tracks.",
      images: [
        {
          url: settings.logo_url || "/logo/Screenshot 2026-08-18 121555.png",
          width: 1200,
          height: 630,
          alt: settings.business_name,
        },
      ],
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${montserrat.variable} ${orbitron.variable} dark scroll-smooth`}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#050505] text-[#F5F5F5] font-sans antialiased selection:bg-[#FF5A00] selection:text-black"
      >
        {children}
      </body>
    </html>
  );
}
