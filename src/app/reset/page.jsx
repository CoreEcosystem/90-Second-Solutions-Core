"use client";
import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import { useResetTimer } from "@/hooks/useResetTimer";
import { useVoiceGuidance } from "@/hooks/useVoiceGuidance";
import { useResetUsage } from "@/hooks/useResetUsage";
import { resetSteps } from "@/data/resetStepsData";
import { ResetHeader } from "@/components/Reset/ResetHeader";
import { PreparePhase } from "@/components/Reset/PreparePhase";
import { ResetPhase } from "@/components/Reset/ResetPhase";
import { CompletePhase } from "@/components/Reset/CompletePhase";
import { UpgradeModal } from "@/components/Reset/UpgradeModal";
// Add react-query for persisting selected emotion
import { useMutation } from "@tanstack/react-query";

// Added page metadata (SEO + social)
export const metadata = {
  title:
    "90‑Second Reset – Interrupt Stress in 90 Seconds | 90‑Second Solutions",
  description:
    "Start a guided 90‑second reset to interrupt stress, restore emotional balance, and return to clear decision-making — anytime, anywhere.",
  keywords:
    "90-second reset, interrupt stress, emotional balance, micro-practices, breathing, grounding, decision-making, neuroscience",
  openGraph: {
    title:
      "90‑Second Reset – Interrupt Stress in 90 Seconds | 90‑Second Solutions",
    description:
      "Guided reset to quickly interrupt stress and restore clarity using science-backed micro-practices.",
    type: "website",
    images: [
      "https://raw.createusercontent.com/392b1331-03ca-4aa9-bc2e-7c86d72d2c93/",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "90‑Second Reset – Interrupt Stress in 90 Seconds | 90‑Second Solutions",
    description:
      "Guided reset to quickly interrupt stress and restore clarity using science-backed micro-practices.",
    images: [
      "https://raw.createusercontent.com/392b1331-03ca-4aa9-bc2e-7c86d72d2c93/",
    ],
  },
};

export default function ResetPage() {
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { data: user } = useUser();

  const {
    isActive,
    seconds,
    phase,
    step,
    progress,
    startReset: timerStartReset,
    pauseReset,
    restartReset: timerRestartReset,
    nextStep,
    prevStep,
    setStep,
  } = useResetTimer();

  const {
    voiceEnabled,
    setVoiceEnabled,
    speechSupported,
    voices,
    preferredVoice,
    selectedVoiceKey,
    speak,
    cancel,
    pause,
    resume,
    handleVoiceChange,
  } = useVoiceGuidance();

  const { usageData, tracking, isLocked, trackUsage } = useResetUsage(user);

  // Persist selected emotion for today's reflection
  const saveEmotionMutation = useMutation({
    mutationFn: async (emotionId) => {
      const res = await fetch("/api/reflection/emotion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetEmotion: emotionId }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(
          `When saving reset emotion, response was [${res.status}] ${text}`,
        );
      }
      return res.json();
    },
    onError: (err) => {
      console.error(err);
    },
  });

  // Helper to speak current step
  const speakCurrentStep = () => {
    if (!speechSupported || !voiceEnabled || phase !== "reset") return;
    const titles = [
      "",
      "Notice and Name",
      "Shift the Body, Settle the Breath",
      "Lead with Empowered Action",
    ];
    const current = resetSteps.find((s) => s.id === step) || {
      title: titles[step] || `Step ${step}`,
      guidance: "",
    };
    const text = `Step ${step}. ${current.title}. ${current.guidance}`;
    speak(text);
  };

  // Speak when entering reset or when step/voice changes, if enabled
  useEffect(() => {
    if (phase === "reset" && voiceEnabled) {
      speakCurrentStep();
    }
    // Cancel when leaving reset
    if (phase !== "reset") {
      cancel();
    }
  }, [step, phase, voiceEnabled, preferredVoice]);

  // Pause/resume TTS with timer state
  useEffect(() => {
    if (!speechSupported || phase !== "reset") return;
    if (!isActive) {
      pause();
    } else {
      resume();
    }
  }, [isActive, phase, speechSupported]);

  const startReset = async () => {
    // Track usage for free users before starting
    if (usageData && !usageData.is_premium) {
      const result = await trackUsage();
      if (result.limitReached) {
        setShowUpgradeModal(true);
        return;
      }
      if (!result.success) {
        return;
      }
    }
    timerStartReset();
  };

  const restartReset = () => {
    setSelectedEmotion(null);
    cancel();
    timerRestartReset();
  };

  const handleEmotionSelect = (emotionId) => {
    if (selectedEmotion === emotionId) {
      setSelectedEmotion(null);
    } else {
      setSelectedEmotion(emotionId);
      setStep(2); // auto-advance to step 2 after selecting
    }
  };

  // When emotion is selected and user is authenticated, persist it
  useEffect(() => {
    if (!user) return; // only persist for signed in users
    if (!selectedEmotion) return;
    saveEmotionMutation.mutate(selectedEmotion);
  }, [selectedEmotion, user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#DCE7DF] via-white to-[#C9D9EB] dark:from-[#1E1E1E] dark:via-[#121212] dark:to-[#2F4A5C]">
      <ResetHeader />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {phase === "prepare" && (
          <PreparePhase
            onStart={startReset}
            isLocked={isLocked}
            tracking={tracking}
            speechSupported={speechSupported}
            voiceEnabled={voiceEnabled}
            setVoiceEnabled={setVoiceEnabled}
            voices={voices}
            selectedVoiceKey={selectedVoiceKey}
            preferredVoice={preferredVoice}
            onVoiceChange={handleVoiceChange}
          />
        )}

        {phase === "reset" && (
          <ResetPhase
            seconds={seconds}
            progress={progress}
            step={step}
            isActive={isActive}
            onPause={pauseReset}
            onPrevStep={prevStep}
            onNextStep={() => nextStep(resetSteps.length)}
            onRestart={restartReset}
            voiceEnabled={voiceEnabled}
            setVoiceEnabled={setVoiceEnabled}
            speechSupported={speechSupported}
            voices={voices}
            selectedVoiceKey={selectedVoiceKey}
            preferredVoice={preferredVoice}
            onVoiceChange={handleVoiceChange}
            selectedEmotion={selectedEmotion}
            onEmotionSelect={handleEmotionSelect}
          />
        )}

        {phase === "complete" && <CompletePhase onRestart={restartReset} />}
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Serif:wght@400;700;900&family=Montserrat:wght@400;600&family=Poppins:wght@500&display=swap');
        
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
