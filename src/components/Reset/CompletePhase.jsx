"use client";
import { RotateCcw, Home } from "lucide-react";
import { useState } from "react";

export function CompletePhase({ onRestart }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="text-center space-y-8">
      {/* Success badge */}
      <div className="space-y-4">
        <div className="w-24 h-24 bg-gradient-to-br from-[#70A0B2] to-[#5C94B0] rounded-full flex items-center justify-center mx-auto">
          <span className="text-4xl">✓</span>
        </div>

        {/* Primary Message */}
        <h2 className="font-roboto-serif font-light text-3xl sm:text-4xl text-[#0B3A55] dark:text-white/90">
          You did it.
        </h2>

        {/* Reframe + Integration */}
        <div className="space-y-2 max-w-xl mx-auto">
          <p className="font-montserrat text-base text-[#0B3A55] dark:text-white/80 leading-relaxed">
            The emotion didn’t disappear — it completed its cycle.
          </p>
          <p className="font-montserrat text-base text-[#557082] dark:text-white/70 leading-relaxed">
            Notice what feels different now. Even a small shift matters.
          </p>
        </div>
      </div>

      {/* Optional Reflection Prompt */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#EDF1F5] dark:border-gray-700 p-6 space-y-4 max-w-lg mx-auto">
        <h3 className="font-roboto-serif font-bold text-lg text-[#0B3A55] dark:text-white/90">
          What changed, if anything?
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setSelected("Calm")}
            className={
              (selected === "Calm"
                ? "bg-[#70A0B2] text-white "
                : "bg-white dark:bg-transparent text-[#0B3A55] dark:text-white ") +
              "border border-[#EDF1F5] dark:border-gray-700 hover:border-[#70A0B2] dark:hover:border-[#70A0B2] font-montserrat text-sm px-4 py-2 rounded-full transition-colors"
            }
            aria-pressed={selected === "Calm"}
          >
            Calm
          </button>
          <button
            onClick={() => setSelected("Clear")}
            className={
              (selected === "Clear"
                ? "bg-[#70A0B2] text-white "
                : "bg-white dark:bg-transparent text-[#0B3A55] dark:text-white ") +
              "border border-[#EDF1F5] dark:border-gray-700 hover:border-[#70A0B2] dark:hover:border-[#70A0B2] font-montserrat text-sm px-4 py-2 rounded-full transition-colors"
            }
            aria-pressed={selected === "Clear"}
          >
            Clear
          </button>
          <button
            onClick={() => setSelected("Same")}
            className={
              (selected === "Same"
                ? "bg-[#70A0B2] text-white "
                : "bg-white dark:bg-transparent text-[#0B3A55] dark:text-white ") +
              "border border-[#EDF1F5] dark:border-gray-700 hover:border-[#70A0B2] dark:hover:border-[#70A0B2] font-montserrat text-sm px-4 py-2 rounded-full transition-colors"
            }
            aria-pressed={selected === "Same"}
          >
            Same
          </button>
          <button
            onClick={() => setSelected("Unsure")}
            className={
              (selected === "Unsure"
                ? "bg-[#70A0B2] text-white "
                : "bg-white dark:bg-transparent text-[#0B3A55] dark:text-white ") +
              "border border-[#EDF1F5] dark:border-gray-700 hover:border-[#70A0B2] dark:hover:border-[#70A0B2] font-montserrat text-sm px-4 py-2 rounded-full transition-colors"
            }
            aria-pressed={selected === "Unsure"}
          >
            Unsure
          </button>
        </div>
      </div>

      {/* Next-Step CTAs */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onRestart}
          className="bg-[#70A0B2] hover:bg-[#5C94B0] text-white font-montserrat font-semibold text-base px-8 py-3 rounded-full transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg flex items-center gap-2 justify-center"
        >
          <RotateCcw className="w-5 h-5" />
          Try Another Reset
        </button>

        <a
          href="/"
          className="bg-white dark:bg-[#1E1E1E] border border-[#EDF1F5] dark:border-gray-700 hover:border-[#70A0B2] dark:hover:border-[#70A0B2] text-[#0B3A55] dark:text-white font-montserrat font-semibold text-base px-8 py-3 rounded-full transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg flex items-center gap-2 justify-center"
        >
          <Home className="w-5 h-5" />
          Return to Your Day
        </a>
      </div>

      {/* Science reinforcement */}
      <p className="font-montserrat text-sm text-[#557082] dark:text-white/60 max-w-md mx-auto">
        This is how your nervous system restores balance.
      </p>
    </div>
  );
}
