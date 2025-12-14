"use client";
import { useLessons } from "@/hooks/useLessons";
import { LessonHeader } from "@/components/Lessons/LessonHeader";
import { LessonHero } from "@/components/Lessons/LessonHero";
import { UsageStatsBar } from "@/components/Lessons/UsageStatsBar";
import { CategoryFilter } from "@/components/Lessons/CategoryFilter";
import { LessonCard } from "@/components/Lessons/LessonCard";
import { UpgradeModal } from "@/components/Lessons/UpgradeModal";
import { ResetCallToAction } from "@/components/Lessons/ResetCallToAction";
import { lessons } from "@/data/lessonsData";

// Added page metadata (SEO + social)
export const metadata = {
  title: "Lessons – Micro‑Coaching in Under 2 Minutes | 90‑Second Solutions",
  description:
    "Quick micro-lessons that teach science-backed micro-practices to interrupt stress, restore emotional balance, and bring you back into clear decision-making.",
  keywords:
    "micro-lessons, micro-coaching, stress management, emotional balance, 90-second reset, decision-making, neuroscience",
  openGraph: {
    title: "Lessons – Micro‑Coaching in Under 2 Minutes | 90‑Second Solutions",
    description:
      "Short, science-backed lessons to help you interrupt stress and return to clarity — fast.",
    type: "website",
    images: [
      "https://raw.createusercontent.com/392b1331-03ca-4aa9-bc2e-7c86d72d2c93/",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lessons – Micro‑Coaching in Under 2 Minutes | 90‑Second Solutions",
    description:
      "Short, science-backed lessons to help you interrupt stress and return to clarity — fast.",
    images: [
      "https://raw.createusercontent.com/392b1331-03ca-4aa9-bc2e-7c86d72d2c93/",
    ],
  },
};

export default function LessonsPage() {
  const {
    selectedCategory,
    setSelectedCategory,
    completedLessons,
    markComplete,
    usageData,
    showUpgradeModal,
    setShowUpgradeModal,
    trackUsage,
    user,
  } = useLessons();

  const filteredLessons =
    selectedCategory === "all"
      ? lessons
      : lessons.filter((lesson) => lesson.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      <LessonHeader />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <LessonHero />

        <UsageStatsBar usageData={usageData} user={user} />

        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredLessons.map((lesson) => {
            const isCompleted = completedLessons.has(lesson.id);

            return (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                isCompleted={isCompleted}
                onComplete={markComplete}
                usageData={usageData}
                trackUsage={trackUsage}
              />
            );
          })}
        </div>

        <ResetCallToAction />
      </div>

      <UpgradeModal
        show={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />

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
