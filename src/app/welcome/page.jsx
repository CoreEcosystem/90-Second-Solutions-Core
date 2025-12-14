"use client";
import { useEffect } from "react";

export default function WelcomePage() {
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("hasSeenWelcome", "1");
      }
    } catch (err) {
      // ignore storage errors
      console.error(err);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="font-montserrat text-3xl sm:text-4xl md:text-5xl font-bold text-[#121212] dark:text-white mb-6">
            Welcome to 90-Second Solutions
          </h1>
          <p className="font-inter text-lg sm:text-xl text-[#1f2937] dark:text-gray-200 leading-relaxed max-w-2xl mx-auto">
            This is a simple, science-based way to regain calm and clarity —
            especially in moments when your mind feels overwhelmed.
          </p>

          <div className="mt-8 space-y-2 text-[#374151] dark:text-gray-300 font-inter">
            <p>You don’t need experience.</p>
            <p>You don’t need to “do it right.”</p>
            <p>You just need 90 seconds.</p>
          </div>

          <div className="mt-10">
            <a
              href="/reset"
              className="inline-block bg-[#538890] hover:bg-[#538890]/90 text-white font-montserrat font-semibold text-base px-6 py-3 rounded-full transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg"
            >
              Start Your First Reset
            </a>
          </div>

          <p className="mt-6 text-sm text-[#6b7280] dark:text-gray-400">
            No overwhelm. No feature dumping.
          </p>
        </div>
      </div>
    </div>
  );
}
