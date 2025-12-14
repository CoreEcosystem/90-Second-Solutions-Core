import { useState, useMemo } from "react";
import { VoiceControls } from "./VoiceControls";
import { TimerCircle } from "./TimerCircle";
import { StepDisplay } from "./StepDisplay";
import { ResetControls } from "./ResetControls";
import { resetSteps } from "@/data/resetStepsData";

export function ResetPhase({
  seconds,
  progress,
  step,
  isActive,
  onPause,
  onPrevStep,
  onNextStep,
  onRestart,
  voiceEnabled,
  setVoiceEnabled,
  speechSupported,
  voices,
  selectedVoiceKey,
  preferredVoice,
  onVoiceChange,
  selectedEmotion,
  onEmotionSelect,
}) {
  const currentStep = resetSteps.find((s) => s.id === step) || resetSteps[0];

  // Add gentle, time-based guidance copy during the active 90 seconds
  const elapsed = useMemo(() => 90 - seconds, [seconds]);
  const activeGuidance = useMemo(() => {
    // Opening Line (0–5s)
    if (elapsed >= 0 && elapsed <= 5) {
      return [
        "Let your attention rest on your breath or body.",
        "Whatever you notice is enough.",
      ];
    }
    // Mid-Reset Guidance (30–60s)
    if (elapsed >= 30 && elapsed <= 60) {
      return [
        "If your mind wanders, that’s normal.",
        "Gently come back to sensation — not thought.",
      ];
    }
    // Reassurance (Subtle, optional) — show briefly around 20–25s
    if (elapsed >= 20 && elapsed < 25) {
      return ["You’re not doing this wrong."];
    }
    // Final Seconds (80–90s)
    if (elapsed >= 80 && elapsed <= 90) {
      return [
        "Allow the feeling to finish moving through.",
        "Nothing else is required.",
      ];
    }
    return null;
  }, [elapsed]);

  return (
    <div className="text-center space-y-8">
      <VoiceControls
        voiceEnabled={voiceEnabled}
        setVoiceEnabled={setVoiceEnabled}
        speechSupported={speechSupported}
        voices={voices}
        selectedVoiceKey={selectedVoiceKey}
        preferredVoice={preferredVoice}
        onVoiceChange={onVoiceChange}
        pickerId="voice-picker-live"
      />

      <TimerCircle seconds={seconds} progress={progress} />

      {/* Time-based gentle guidance */}
      {activeGuidance && (
        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#EDF1F5] dark:border-gray-700 p-5 sm:p-6 max-w-xl mx-auto space-y-2">
          {activeGuidance.map((line, idx) => (
            <p
              key={idx}
              className="font-montserrat text-base text-[#557082] dark:text-white/70 leading-relaxed"
            >
              {line}
            </p>
          ))}
        </div>
      )}

      <StepDisplay
        currentStep={currentStep}
        stepNumber={step}
        totalSteps={resetSteps.length}
        selectedEmotion={selectedEmotion}
        onEmotionSelect={onEmotionSelect}
      />

      <ResetControls
        isActive={isActive}
        onPause={onPause}
        onPrevStep={onPrevStep}
        onNextStep={onNextStep}
        onRestart={onRestart}
        canGoPrev={step > 1}
        canGoNext={step < resetSteps.length}
      />
    </div>
  );
}
