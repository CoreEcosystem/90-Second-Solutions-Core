"use client";
import useUser from "@/utils/useUser";
import { useRef, useEffect } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import { useFadeInOnScroll } from "@/hooks/useFadeInOnScroll";
import { BackgroundImages } from "@/components/HomePage/BackgroundImages";
import { Header } from "@/components/HomePage/Header";
import { HeroSection } from "@/components/HomePage/HeroSection";
import { TwoPillars } from "@/components/HomePage/TwoPillars";
import { HowItWorks } from "@/components/HomePage/HowItWorks";
import { TrustAuthority } from "@/components/HomePage/TrustAuthority";
import { ScienceFoundation } from "@/components/HomePage/ScienceFoundation";
import { Footer } from "@/components/HomePage/Footer";
import { GlobalStyles } from "@/components/HomePage/GlobalStyles";

export const metadata = {
  title:
    "When Your Mind Is Overwhelmed, 90 Seconds Is All You Need | 90-Second Solutions",
  description:
    "Science-backed micro-practices to interrupt stress, restore emotional balance, and bring you back into clear decision-making — anytime, anywhere.",
  keywords:
    "90-second reset, micro-practices, stress management, emotional balance, overwhelm, clear decision-making, neuroscience techniques, anxiety relief, professionals, leaders, caregivers, high-performers",
  openGraph: {
    title:
      "When Your Mind Is Overwhelmed, 90 Seconds Is All You Need | 90-Second Solutions",
    description:
      "Science-backed micro-practices to interrupt stress, restore emotional balance, and bring you back into clear decision-making — anytime, anywhere. Built for professionals, leaders, caregivers, and high-performers.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "When Your Mind Is Overwhelmed, 90 Seconds Is All You Need | 90-Second Solutions",
    description:
      "Science-backed micro-practices to interrupt stress, restore emotional balance, and bring you back into clear decision-making — anytime, anywhere.",
  },
};

export default function HomePage() {
  const { data: user, loading: userLoading } = useUser();
  const { subscription } = useSubscription(user, userLoading);
  const howItWorksRef = useRef(null);
  // Add fade-in on scroll for Trust & Authority section
  const trustAuthorityRef = useRef(null);

  useFadeInOnScroll(howItWorksRef);
  useFadeInOnScroll(trustAuthorityRef);

  const isPremium = subscription?.is_premium;

  // ADDED: First-time redirect to /welcome
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const alreadySeen = localStorage.getItem("hasSeenWelcome");
      const isWelcomePage = window.location.pathname === "/welcome";
      if (!alreadySeen && !isWelcomePage) {
        localStorage.setItem("hasSeenWelcome", "1");
        window.location.href = "/welcome";
      }
    } catch (err) {
      // If storage is blocked, just continue without redirect
      console.error(err);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] relative">
      <BackgroundImages />
      <Header user={user} userLoading={userLoading} isPremium={isPremium} />

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 relative">
        <div className="relative z-10 max-w-7xl mx-auto">
          <HeroSection />
          <TwoPillars />
          <HowItWorks howItWorksRef={howItWorksRef} />
          {/* Pass ref and keep default visibility of proof items; sizing can be tuned via emphasisLevel prop */}
          <TrustAuthority containerRef={trustAuthorityRef} />
          <ScienceFoundation />
        </div>
      </section>

      <Footer />
      <GlobalStyles />
    </div>
  );
}
