"use client";
import { ChevronLeft } from "lucide-react";
import useUser from "@/utils/useUser";

export function LessonHeader() {
  const { data: user, loading: userLoading } = useUser();
  return (
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
        {/* Secondary links: Reflection + Your Insights (shown when signed in) */}
        {!userLoading && user ? (
          <div className="py-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-center gap-4">
            <a
              href="/reflection"
              className="font-montserrat font-semibold text-sm text-[#538890]/85 dark:text-white/85 hover:text-[#538890] dark:hover:text-white hover:underline hover:decoration-[#538890] dark:hover:decoration-white hover:underline-offset-4 transition-all duration-200"
            >
              Reflection
            </a>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <a
              href="/insights"
              className="font-montserrat font-semibold text-sm text-[#538890]/85 dark:text-white/85 hover:text-[#538890] dark:hover:text-white hover:underline hover:decoration-[#538890] dark:hover:decoration-white hover:underline-offset-4 transition-all duration-200"
            >
              Your Insights
            </a>
          </div>
        ) : null}
      </div>
    </header>
  );
}
