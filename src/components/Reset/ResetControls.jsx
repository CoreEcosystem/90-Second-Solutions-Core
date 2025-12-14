import { Play, Pause, ChevronLeft, RotateCcw } from "lucide-react";

export function ResetControls({
  isActive,
  onPause,
  onPrevStep,
  onNextStep,
  onRestart,
  canGoPrev,
  canGoNext,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={onPrevStep}
          disabled={!canGoPrev}
          className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-[#0B3A55] dark:text-white p-3 rounded-full transition-all duration-200"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={onPause}
          className="bg-[#70A0B2] hover:bg-[#5C94B0] text-white p-4 rounded-full transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg"
        >
          {isActive ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6" />
          )}
        </button>

        <button
          onClick={onNextStep}
          disabled={!canGoNext}
          className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-[#0B3A55] dark:text-white p-3 rounded-full transition-all duration-200 transform rotate-180"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      <button
        onClick={onRestart}
        className="font-montserrat font-semibold text-sm text-[#557082] dark:text-white/70 hover:text-[#0B3A55] dark:hover:text-white transition-all duration-200 flex items-center gap-2 mx-auto"
      >
        <RotateCcw className="w-4 h-4" />
        Start Over
      </button>
    </div>
  );
}
