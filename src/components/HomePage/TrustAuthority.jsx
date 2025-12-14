export function TrustAuthority({
  containerRef,
  // Proof element toggles (default to true)
  showUsedBy = true,
  showBackedBy = true,
  showDesignedFor = true,
  // Visual weight: 'low' | 'normal' | 'high'
  emphasisLevel = "normal",
}) {
  // Determine sizes and spacing based on emphasisLevel
  const headerSizes =
    emphasisLevel === "high"
      ? "text-3xl sm:text-4xl lg:text-[40px]"
      : emphasisLevel === "low"
        ? "text-xl sm:text-2xl lg:text-3xl"
        : "text-2xl sm:text-3xl lg:text-4xl";

  const paragraphSizes =
    emphasisLevel === "high"
      ? "text-lg sm:text-xl"
      : emphasisLevel === "low"
        ? "text-sm sm:text-base"
        : "text-base sm:text-lg";

  const containerMargins =
    emphasisLevel === "high"
      ? "mt-20 sm:mt-24 lg:mt-28"
      : emphasisLevel === "low"
        ? "mt-12 sm:mt-14 lg:mt-16"
        : "mt-16 sm:mt-20 lg:mt-24";

  const headerMargin =
    emphasisLevel === "high"
      ? "mb-7"
      : emphasisLevel === "low"
        ? "mb-4"
        : "mb-6";

  const paragraphMargin =
    emphasisLevel === "high"
      ? "mb-10"
      : emphasisLevel === "low"
        ? "mb-6"
        : "mb-8";

  return (
    <div
      ref={containerRef}
      className={`${containerMargins} max-w-4xl mx-auto text-center px-4 fade-in-on-scroll`}
    >
      {/* Header */}
      <h2
        className={`${headerSizes} font-semibold text-[#121212] dark:text-white ${headerMargin}`}
      >
        Why This Works
      </h2>

      {/* Short Authority Copy */}
      <p
        className={`${paragraphSizes} text-[#4A4A4A] dark:text-[#B0B0B0] leading-relaxed ${paragraphMargin} max-w-2xl mx-auto`}
      >
        Most stress tools focus on suppression or distraction.
        <br />
        <span className="text-[#121212] dark:text-white font-medium">
          90-Second Solutions works <em>with</em> your biology — not against it.
        </span>
      </p>

      {/* Optional Proof Elements */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-[#6B6B6B] dark:text-[#909090]">
        {showUsedBy && (
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>
            <span>Used by leaders, coaches, and professionals</span>
          </div>
        )}
        {showBackedBy && (
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>
            <span>Backed by neuroscience</span>
          </div>
        )}
        {showDesignedFor && (
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>
            <span>Designed for real-world pressure</span>
          </div>
        )}
      </div>
    </div>
  );
}
