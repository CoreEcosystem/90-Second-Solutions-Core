"use client";
import { useState } from "react";
import {
  ChevronLeft,
  TrendingUp,
  Target,
  Calendar,
  Lightbulb,
  Download,
} from "lucide-react";
import StopwatchIcon from "@/components/StopwatchIcon";
// Add react-query to load today's reflection data
import { useQuery } from "@tanstack/react-query";
// Map reset emotion id -> label
import { emotions } from "@/data/resetStepsData";

// Added page metadata (SEO + social)
export const metadata = {
  title:
    "Insights – Patterns From Your 90‑Second Reflections | 90‑Second Solutions",
  description:
    "See patterns and themes from your daily 90‑second reflections. Science-backed micro-practices help you interrupt stress, restore emotional balance, and return to clear decision-making — anytime, anywhere.",
  keywords:
    "reflection insights, 90-second reset, micro-practices, stress patterns, emotional balance, overwhelm, clear decision-making, neuroscience",
  openGraph: {
    title:
      "Insights – Patterns From Your 90‑Second Reflections | 90‑Second Solutions",
    description:
      "See patterns and themes from your daily 90‑second reflections. Science-backed micro-practices help you interrupt stress and return to clear decision-making.",
    type: "website",
    images: [
      "https://raw.createusercontent.com/392b1331-03ca-4aa9-bc2e-7c86d72d2c93/",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Insights – Patterns From Your 90‑Second Reflections | 90‑Second Solutions",
    description:
      "See patterns and themes from your daily 90‑second reflections. Science-backed micro-practices help you interrupt stress and return to clear decision-making.",
    images: [
      "https://raw.createusercontent.com/392b1331-03ca-4aa9-bc2e-7c86d72d2c93/",
    ],
  },
};

export default function InsightsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  // Fetch today's reflection to surface Reset Emotion + Reflection inputs
  const { data: todayData } = useQuery({
    queryKey: ["reflection", "today"],
    queryFn: async () => {
      const res = await fetch("/api/reflection/today");
      // If unauthenticated, just return empty so page still renders
      if (res.status === 401) {
        return { reflection: null };
      }
      if (!res.ok) {
        throw new Error(
          `When fetching /api/reflection/today, the response was [${res.status}] ${res.statusText}`,
        );
      }
      return res.json();
    },
  });

  // NEW: Fetch summary insights (values, reflections streaks, action focus) for period
  const {
    data: summary,
    isLoading: summaryLoading,
    error: summaryError,
  } = useQuery({
    queryKey: ["insights", "summary", selectedPeriod],
    queryFn: async () => {
      const res = await fetch(`/api/insights/summary?period=${selectedPeriod}`);
      if (res.status === 401) {
        // not signed in -> fall back to mock content
        return null;
      }
      if (!res.ok) {
        throw new Error(
          `When fetching /api/insights/summary, the response was [${res.status}] ${res.statusText}`,
        );
      }
      return res.json();
    },
  });

  const todaysReflection = todayData?.reflection || null;
  const resetEmotionId = todaysReflection?.reset_emotion || null;
  const resetEmotionMeta = resetEmotionId
    ? emotions.find((e) => e.id === resetEmotionId) || {
        label: resetEmotionId,
        emoji: "",
      }
    : null;

  // Mock data - in real app, this would come from user's reflection data
  const insights = {
    week: {
      period: "This Week",
      dateRange: "November 11-17, 2025",
      reflectionStreak: "5 days",
      topValues: ["Creativity", "Family", "Growth"],
      emotionalThemes: ["Focused", "Grateful", "Determined"],
      actionPatterns: [
        "Connection-focused",
        "Learning-oriented",
        "Health-conscious",
      ],
      keyInsight:
        "You consistently chose values around growth and connection this week.",
      patterns: [
        {
          title: "Your Values This Week",
          description:
            "You tended to choose Creativity and Family most often, with Growth appearing in 4 out of 5 reflections.",
          trend: "stable",
        },
        {
          title: "Reflection Pattern",
          description:
            "Your strongest reflection streak was Tuesday through Saturday. You found your rhythm mid-week.",
          trend: "up",
        },
        {
          title: "Action Focus",
          description:
            "Most of your micro-actions centered on connection and creative projects.",
          trend: "up",
        },
      ],
    },
    month: {
      period: "This Month",
      dateRange: "October 18 - November 17, 2025",
      reflectionStreak: "18 days",
      topValues: ["Family", "Creativity", "Health", "Growth"],
      emotionalThemes: ["Grateful", "Focused", "Peaceful", "Determined"],
      actionPatterns: [
        "Relationship-building",
        "Creative projects",
        "Wellness habits",
      ],
      keyInsight:
        "Family and creativity have been your consistent anchors this month.",
      patterns: [
        {
          title: "Monthly Value Themes",
          description:
            "Family appeared in 78% of your reflections, followed by Creativity (65%) and Health (52%).",
          trend: "stable",
        },
        {
          title: "Emotional Journey",
          description:
            "You experienced increasing feelings of gratitude and focus as the month progressed.",
          trend: "up",
        },
        {
          title: "Action Evolution",
          description:
            "Your micro-actions evolved from planning-focused to implementation-focused over the month.",
          trend: "up",
        },
      ],
    },
  };

  // Build dynamic content (with fallback to mock)
  const currentInsights = insights[selectedPeriod];
  const dateRangeLabel = summary?.dateRangeLabel || currentInsights.dateRange;
  const reflectionDaysText = summary
    ? `${summary.reflectionDays} days`
    : currentInsights.reflectionStreak;
  const topValuesNames = summary?.topValues?.length
    ? summary.topValues.map((v) => v.name)
    : currentInsights.topValues;
  const actionFocusLabels = summary?.actionFocus?.length
    ? summary.actionFocus.map((a) => a.label)
    : currentInsights.actionPatterns;

  // Pattern cards (3): Your Values This Week, Reflection Pattern, Action Focus
  const dynamicPatterns = summary
    ? [
        {
          title: "Your Values This Week",
          description: topValuesNames.length
            ? `Top values: ${topValuesNames.slice(0, 3).join(", ")}. Chosen on ${summary.valuesDaysWithAny} of ${summary.windowLen} days.`
            : "No values selected this period.",
          trend: summary.trends?.values || "stable",
        },
        {
          title: "Reflection Pattern",
          description: `You reflected on ${summary.reflectionDays} of ${summary.windowLen} days this ${selectedPeriod}.`,
          trend: summary.trends?.reflections || "stable",
        },
        {
          title: "Action Focus",
          description: actionFocusLabels.length
            ? `Most common focus: ${actionFocusLabels.slice(0, 2).join(", ")}.`
            : "Not enough text yet to determine a focus.",
          trend: summary.trends?.actions || "stable",
        },
      ]
    : currentInsights.patterns;

  const exportInsights = () => {
    // Mock export functionality
    console.log("Exporting insights...");
  };

  // Helper renderers for today's reflection
  const renderFeelings = (feelings) => {
    if (!feelings) return null;
    let arr = feelings;
    if (typeof feelings === "string") {
      try {
        arr = JSON.parse(feelings);
      } catch {
        arr = [];
      }
    }
    if (!Array.isArray(arr) || arr.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-1">
        {arr.map((f, idx) => (
          <span
            key={`${f}-${idx}`}
            className="bg-[#E6F1EB]/80 text-[#538890] px-2 py-1 rounded-full text-xs font-montserrat font-semibold"
          >
            {f}
          </span>
        ))}
      </div>
    );
  };

  const journalPreview = (
    todaysReflection?.journaling_text ||
    todaysReflection?.micro_action ||
    ""
  ).split("\n")[0];

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
            <div className="w-[120px]"></div> {/* Spacer for centering */}
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero */}
        <div className="text-center space-y-6 mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-[#538890] to-[#538890]/80 rounded-full flex items-center justify-center mx-auto">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>

          <h1 className="font-roboto-serif font-light text-3xl sm:text-4xl lg:text-5xl text-[#538890] dark:text-white/90 max-w-3xl mx-auto">
            Your reflection insights
          </h1>

          <p className="font-montserrat text-base sm:text-lg text-[#538890]/70 dark:text-white/70 leading-relaxed max-w-2xl mx-auto">
            Patterns and themes from your daily check-ins. These observations
            help you understand your emotional landscape—no judgment, just
            awareness.
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-[#E6F1EB]/30 dark:bg-gray-800/50 rounded-full p-1">
            {[
              { id: "week", label: "This Week" },
              { id: "month", label: "This Month" },
            ].map((period) => (
              <button
                key={period.id}
                onClick={() => setSelectedPeriod(period.id)}
                className={`px-6 py-3 rounded-full font-montserrat font-semibold text-sm transition-all duration-200 ${
                  selectedPeriod === period.id
                    ? "bg-[#538890] text-white shadow-lg"
                    : "text-[#538890] dark:text-white hover:bg-[#E6F1EB]/50 dark:hover:bg-gray-700"
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Insights */}
        <div className="space-y-8">
          {/* Overview Card */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#E6F1EB] dark:border-gray-700 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-roboto-serif font-bold text-2xl text-[#538890] dark:text-white/90 mb-2">
                  {selectedPeriod === "week" ? "This Week" : "This Month"}{" "}
                  Overview
                </h2>
                <p className="font-montserrat text-sm text-[#538890]/70 dark:text-white/70">
                  {dateRangeLabel}
                </p>
              </div>
              <button
                onClick={exportInsights}
                className="flex items-center gap-2 px-4 py-2 bg-[#E6F1EB] dark:bg-gray-800 hover:bg-[#E6F1EB]/80 dark:hover:bg-gray-700 text-[#538890] dark:text-white font-montserrat font-semibold text-sm rounded-lg transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-[#538890]" />
                  <span className="font-montserrat text-sm text-[#538890]/70 dark:text-white/70">
                    Reflection Days
                  </span>
                </div>
                <span className="font-roboto-serif font-bold text-2xl text-[#538890] dark:text-white/90">
                  {reflectionDaysText}
                </span>
              </div>

              <div className="text-center p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <StopwatchIcon className="w-5 h-5" color="#D3C970" />
                  <span className="font-montserrat text-sm text-[#538890]/70 dark:text-white/70">
                    Top Values
                  </span>
                </div>
                <div className="flex flex-wrap justify-center gap-1">
                  {topValuesNames.slice(0, 3).map((value, index) => (
                    <span
                      key={index}
                      className="bg-[#D3C970]/20 text-[#538890] px-2 py-1 rounded-full text-xs font-montserrat font-semibold"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-center p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-[#538890]" />
                  <span className="font-montserrat text-sm text-[#538890]/70 dark:text-white/70">
                    Action Focus
                  </span>
                </div>
                <div className="flex flex-wrap justify-center gap-1">
                  {actionFocusLabels.slice(0, 2).map((pattern, index) => (
                    <span
                      key={index}
                      className="bg-[#E6F1EB]/80 text-[#538890] px-2 py-1 rounded-full text-xs font-montserrat font-semibold"
                    >
                      {pattern}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Today's Reflection Snapshot */}
            <div className="bg-[#E6F1EB]/30 dark:bg-gray-800/30 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-[#D3C970] flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-roboto-serif font-bold text-lg text-[#538890] dark:text-white/90 mb-2">
                    Today's snapshot
                  </h3>
                  {/* Reset Emotion */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="font-montserrat text-sm text-[#538890]/70 dark:text-white/70">
                      Reset Emotion:
                    </span>
                    <span className="font-montserrat text-sm text-[#538890] dark:text-white/90">
                      {resetEmotionMeta ? (
                        <>
                          <span className="mr-1" aria-hidden>
                            {resetEmotionMeta.emoji}
                          </span>
                          {resetEmotionMeta.label}
                        </>
                      ) : (
                        "Not recorded"
                      )}
                    </span>
                  </div>
                  {/* Feelings + Energy */}
                  <div className="flex flex-wrap items-center gap-4 mb-3">
                    {renderFeelings(todaysReflection?.feelings)}
                    {typeof todaysReflection?.energy === "number" ? (
                      <span className="font-montserrat text-sm text-[#538890]/80 dark:text-white/80">
                        Energy: {todaysReflection.energy}
                      </span>
                    ) : null}
                  </div>
                  {/* Journal preview */}
                  {journalPreview ? (
                    <p className="font-montserrat text-base text-[#538890]/80 dark:text-white/80 leading-relaxed">
                      “{journalPreview}”
                    </p>
                  ) : (
                    <p className="font-montserrat text-sm text-[#538890]/60 dark:text-white/60">
                      No journal text saved yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Pattern Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {dynamicPatterns.map((pattern, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#E6F1EB] dark:border-gray-700 p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-roboto-serif font-bold text-lg text-[#538890] dark:text-white/90">
                    {pattern.title}
                  </h3>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      pattern.trend === "up"
                        ? "bg-green-400"
                        : pattern.trend === "stable"
                          ? "bg-[#D3C970]"
                          : "bg-gray-400"
                    }`}
                  />
                </div>
                <p className="font-montserrat text-sm text-[#538890]/70 dark:text-white/70 leading-relaxed">
                  {pattern.description}
                </p>
              </div>
            ))}
          </div>

          {/* Encouragement */}
          <div className="text-center space-y-6 mt-12">
            <div className="bg-gradient-to-r from-[#E6F1EB]/20 to-[#D3C970]/20 dark:from-gray-800/30 dark:to-gray-700/30 rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="font-roboto-serif font-bold text-xl text-[#538890] dark:text-white/90 mb-4">
                You can begin again anytime
              </h3>
              <p className="font-montserrat text-base text-[#538890]/70 dark:text-white/70 leading-relaxed mb-6">
                These insights show your patterns, not your performance. Every
                day is a fresh opportunity to align with what matters most to
                you.
              </p>
              {/* Restore CTA button and remove image */}
              <a
                href="/reflection"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#538890] hover:bg-[#477680] text-white font-montserrat font-semibold shadow-md transition-all duration-200"
              >
                Start Today's Reflection →
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Serif:wght@400;700;900&family=Montserrat:wght@400;600&display=swap');
        
        .font-roboto-serif {
          font-family: 'Roboto Serif', serif;
        }
        
        .font-montserrat {
          font-family: 'Montserrat', sans-serif;
        }
      `}</style>
    </div>
  );
}
