import React from "react";
import { Header } from "@/components/public/Header";
import { Hero } from "@/components/public/Hero";
import { WorldSection } from "@/components/public/WorldSection";
import { ComingSoonBanner } from "@/components/public/ComingSoonBanner";
import { AboutSection } from "@/components/public/AboutSection";
import { ExperienceSection } from "@/components/public/ExperienceSection";
import { ContactSection } from "@/components/public/ContactSection";
import { Footer } from "@/components/public/Footer";

import {
  getSiteSettings,
  getNavigationItems,
  getHero,
  getCategories,
  getActiveBanners,
  getAboutSection,
  getFeatures,
  getExperiences,
  getSocialLinks,
} from "@/lib/queries";

export const revalidate = 0;

export default async function HomePage() {
  const [
    settings,
    navigation,
    hero,
    categories,
    banners,
    about,
    features,
    experiences,
    socialLinks,
  ] = await Promise.all([
    getSiteSettings(),
    getNavigationItems(),
    getHero(),
    getCategories(),
    getActiveBanners(),
    getAboutSection(),
    getFeatures(),
    getExperiences(),
    getSocialLinks(),
  ]);

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#111111] selection:bg-[#FF5A00] selection:text-white relative">
      {/* 1. Header Navigation */}
      <Header settings={settings} navigation={navigation} />

      {/* 2. Hero Section */}
      <Hero hero={hero} settings={settings} />

      {/* 3. Categories 5-Icon Horizontal Strip Module */}
      <WorldSection categories={categories} />

      {/* 4. Coming Soon Banner */}
      <ComingSoonBanner banners={banners} />

      {/* 5. About Section + 4 Features Grid */}
      <AboutSection about={about} features={features} />

      {/* 6. Experience The Thrill Track Cards */}
      <ExperienceSection experiences={experiences} />

      {/* 7. Contact Info Dark Panel */}
      <ContactSection settings={settings} />

      {/* 8. Social Bar & Footer */}
      <Footer
        settings={settings}
        navigation={navigation}
        socialLinks={socialLinks}
      />
    </main>
  );
}
