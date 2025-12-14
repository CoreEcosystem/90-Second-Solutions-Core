import { EmotionPicker } from "./EmotionPicker";

export function StepDisplay({
  currentStep,
  stepNumber,
  totalSteps,
  selectedEmotion,
  onEmotionSelect,
}) {
  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#EDF1F5] dark:border-gray-700 p-6 sm:p-8 space-y-4">
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="bg-[#70A0B2] text-white px-3 py-1 rounded-full text-xs font-montserrat font-semibold">
          Step {stepNumber} of {totalSteps}
        </span>
        {selectedEmotion && (
          <span className="ml-2 bg-[#E8F1F4] text-[#0B3A55] dark:bg-[#2A3A44] dark:text-white/80 px-3 py-1 rounded-full text-xs font-montserrat font-semibold capitalize">
            Feeling: {selectedEmotion}
          </span>
        )}
      </div>

      <h3 className="font-roboto-serif font-bold text-2xl text-[#0B3A55] dark:text-white/90">
        {currentStep.title}
      </h3>
      {currentStep.instruction && (
        <p className="font-montserrat text-lg text-[#0B3A55] dark:text-white/90 font-semibold">
          {currentStep.instruction}
        </p>
      )}
      <p
        className="font-montserrat text-base text-[#557082] dark:text-white/70 leading-relaxed"
        style={{ whiteSpace: "pre-line" }}
      >
        {currentStep.guidance}
      </p>

      {/* Emotion picker - only show on step 1 */}
      {stepNumber === 1 && (
        <EmotionPicker
          selectedEmotion={selectedEmotion}
          onSelect={onEmotionSelect}
        />
      )}
    </div>
  );
}
