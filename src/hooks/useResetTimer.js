import { useState, useEffect, useRef } from "react";

export function useResetTimer() {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(90);
  const [phase, setPhase] = useState("prepare"); // 'prepare', 'reset', 'complete'
  const [step, setStep] = useState(1);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            setPhase("complete");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, seconds]);

  const startReset = () => {
    setIsActive(true);
    setPhase("reset");
    setSeconds(90);
    setStep(1);
  };

  const pauseReset = () => {
    setIsActive(!isActive);
  };

  const restartReset = () => {
    setIsActive(false);
    setPhase("prepare");
    setSeconds(90);
    setStep(1);
  };

  const nextStep = (maxSteps) => {
    if (step < maxSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const progress = ((90 - seconds) / 90) * 100;

  return {
    isActive,
    seconds,
    phase,
    step,
    progress,
    startReset,
    pauseReset,
    restartReset,
    nextStep,
    prevStep,
    setStep,
  };
}
