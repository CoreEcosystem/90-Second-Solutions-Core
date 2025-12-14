"use client";
import { ChevronLeft, ShieldCheck, Lock, Clock } from "lucide-react";

export default function PrivacyPage() {
  const lastUpdated = "December 13, 2025";
  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-[#121212] border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center justify-between h-16">
            <a
              href="/"
              className="flex items-center gap-2 font-montserrat font-semibold text-base text-[#538890]/85 dark:text-white/85 hover:text-[#538890] dark:hover:text-white transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Home
            </a>
            <img
              src="https://ucarecdn.com/3cfbf65a-b402-47be-8ba6-2041dda41592/-/format/auto/"
              alt="90-Second Solutions"
              className="h-10 w-auto"
            />
            <div className="w-[120px]"></div>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Last updated banner */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E6F1EB] dark:border-gray-700 bg-white dark:bg-[#1E1E1E] text-[#2F5C68] dark:text-white/80 text-xs font-montserrat">
            <Clock className="w-4 h-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>

        {/* Hero */}
        <div className="text-center space-y-5 mb-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#538890] to-[#538890]/80 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="font-roboto-serif font-light text-3xl sm:text-4xl text-[#538890] dark:text-white/90">
              Privacy & Data Ethics
            </h1>
            <p className="font-montserrat text-sm text-[#538890]/70 dark:text-white/70">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-zinc max-w-none dark:prose-invert">
          <h2 className="font-roboto-serif text-2xl text-[#538890] dark:text-white/90 mb-2">
            Our approach
          </h2>
          <p className="font-montserrat text-base text-[#4A4A4A] dark:text-[#B0B0B0] mb-6">
            Your trust matters. We collect and use only what’s needed to deliver
            your 90‑second resets, lessons, and insights — nothing more.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#E6F1EB] dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Lock className="w-5 h-5 text-[#538890]" />
                <h3 className="font-montserrat font-semibold text-lg text-[#538890] dark:text-white/90">
                  Data we collect
                </h3>
              </div>
              <ul className="list-disc pl-5 space-y-2 font-montserrat text-sm text-[#538890]/80 dark:text-white/80">
                <li>Account details (name, email)</li>
                <li>Basic usage (sessions, lessons, resets completed)</li>
                <li>
                  Optional inputs you add (e.g., custom values, reflections)
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#E6F1EB] dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="w-5 h-5 text-[#538890]" />
                <h3 className="font-montserrat font-semibold text-lg text-[#538890] dark:text-white/90">
                  How we use it
                </h3>
              </div>
              <ul className="list-disc pl-5 space-y-2 font-montserrat text-sm text-[#538890]/80 dark:text-white/80">
                <li>To sign you in and personalize your experience</li>
                <li>To save your progress and show insights</li>
                <li>To improve the product responsibly</li>
              </ul>
            </div>
          </div>

          <h3 className="font-roboto-serif text-xl text-[#538890] dark:text-white/90 mt-8 mb-3">
            Your choices
          </h3>
          <ul className="list-disc pl-5 space-y-2 font-montserrat text-sm text-[#538890]/80 dark:text-white/80 mb-6">
            <li>You can update your name anytime in your profile.</li>
            <li>
              You can request export or deletion of your data by contacting
              support.
            </li>
            <li>You can opt out of non-essential communications.</li>
          </ul>

          <h3 className="font-roboto-serif text-xl text-[#538890] dark:text-white/90 mt-8 mb-3">
            Security
          </h3>
          <p className="font-montserrat text-base text-[#4A4A4A] dark:text-[#B0B0B0] mb-6">
            We use reputable infrastructure and industry-standard practices to
            protect your data. No system is perfect, but we work to safeguard
            your information and review our approach regularly.
          </p>

          <h3 className="font-roboto-serif text-xl text-[#538890] dark:text-white/90 mt-8 mb-3">
            Contact
          </h3>
          <p className="font-montserrat text-base text-[#4A4A4A] dark:text-[#B0B0B0]">
            Questions about privacy or data ethics? Reach us anytime at
            <a
              href="/contact"
              className="ml-1 text-[#538890] dark:text-white hover:underline"
            >
              /contact
            </a>
            .
          </p>
        </div>
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Serif:wght@400;700;900&family=Montserrat:wght@400;600&display=swap');
        .font-roboto-serif { font-family: 'Roboto Serif', serif; }
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
        .prose :where(h2,h3){ margin-top: 0; }
      `}</style>
    </div>
  );
}
