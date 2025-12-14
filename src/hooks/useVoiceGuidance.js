import { useState, useEffect, useRef } from "react";

export function useVoiceGuidance() {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [voices, setVoices] = useState([]);
  const [preferredVoice, setPreferredVoice] = useState(null);
  const [selectedVoiceKey, setSelectedVoiceKey] = useState("");
  const synthRef = useRef(null);
  const utteranceRef = useRef(null);

  // Load/save voice preference, detect support, and load voices
  useEffect(() => {
    if (typeof window === "undefined") return;
    const supported = "speechSynthesis" in window;
    setSpeechSupported(supported);

    if (supported) {
      synthRef.current = window.speechSynthesis;

      const loadVoices = () => {
        try {
          const list = window.speechSynthesis.getVoices() || [];
          setVoices(list);
        } catch (e) {
          // ignore voice loading errors
        }
      };

      // Some browsers need this event to populate voices
      window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
      // Try immediately as well (Chrome sometimes already has voices)
      loadVoices();

      // cleanup
      return () => {
        try {
          window.speechSynthesis.removeEventListener(
            "voiceschanged",
            loadVoices,
          );
        } catch (e) {
          /* noop */
        }
      };
    }
  }, []);

  // Load saved voice toggle and preferred voice selection on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const savedToggle = localStorage.getItem("voiceEnabled");
      if (savedToggle !== null) {
        setVoiceEnabled(savedToggle === "true");
      }
      const savedVoiceKey = localStorage.getItem("preferredVoiceURI");
      if (savedVoiceKey) {
        setSelectedVoiceKey(savedVoiceKey);
      }
    } catch (e) {
      // ignore storage errors
    }
  }, []);

  // Persist voice toggle and cancel if turned off
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("voiceEnabled", String(voiceEnabled));
    } catch (e) {
      // ignore storage errors
    }
    if (!voiceEnabled && synthRef.current) {
      try {
        synthRef.current.cancel();
      } catch (e) {
        /* noop */
      }
    }
  }, [voiceEnabled]);

  // Pick a soft, US female voice when possible (only if user hasn't chosen one)
  useEffect(() => {
    if (!speechSupported || !voices || voices.length === 0) return;
    if (selectedVoiceKey) return; // user selection takes precedence

    const lower = (s) => (s || "").toLowerCase();
    const isEnUS = (v) =>
      lower(v.lang).startsWith("en-us") || lower(v.lang) === "en_us";

    const enUS = voices.filter(isEnUS);
    const enFallback = voices.filter((v) => lower(v.lang).startsWith("en"));
    const pool = enUS.length ? enUS : enFallback.length ? enFallback : voices;

    // Preference list for common US female voices across platforms
    const namePrefs = [
      "Samantha", // macOS
      "Google US English", // Chrome
      "Microsoft Zira", // Windows
      "Aria", // Edge
      "Jenny",
      "Joanna",
      "Kendra",
      "Salli",
      "Kimberly",
      "Allison",
      "Olivia",
    ].map((n) => n.toLowerCase());

    let chosen = null;
    for (const pref of namePrefs) {
      const match = pool.find((v) => lower(v.name).includes(pref));
      if (match) {
        chosen = match;
        break;
      }
    }
    if (!chosen) {
      chosen = pool[0] || voices[0] || null;
    }
    setPreferredVoice(chosen || null);
  }, [voices, speechSupported, selectedVoiceKey]);

  // Apply user-selected voice when available
  useEffect(() => {
    if (!speechSupported || !voices || voices.length === 0) return;
    if (!selectedVoiceKey) return;
    const getKey = (v) => v.voiceURI || `${v.name}|${v.lang}`;
    const match = voices.find((v) => getKey(v) === selectedVoiceKey);
    if (match) {
      setPreferredVoice(match);
    }
  }, [selectedVoiceKey, voices, speechSupported]);

  const speak = (text) => {
    if (!speechSupported || !voiceEnabled || !synthRef.current) return;
    try {
      synthRef.current.cancel();
      const clean = (t) =>
        (t || "").replace(/\n+/g, ". ").replace(/\s+/g, " ").trim();
      const cleanText = clean(text);
      const u = new SpeechSynthesisUtterance(cleanText);
      // Softer delivery
      u.rate = 0.95; // a touch slower for calm pacing
      u.pitch = 1.05; // slightly higher can feel softer
      u.volume = 0.9; // a bit under max volume
      if (preferredVoice) {
        u.voice = preferredVoice;
      }
      utteranceRef.current = u;
      synthRef.current.speak(u);
    } catch (e) {
      console.error("Voice guidance error:", e);
    }
  };

  const cancel = () => {
    if (synthRef.current) {
      try {
        synthRef.current.cancel();
      } catch (e) {
        /* noop */
      }
    }
  };

  const pause = () => {
    if (synthRef.current) {
      try {
        synthRef.current.pause();
      } catch (e) {
        // some browsers may not support pause/resume well
      }
    }
  };

  const resume = () => {
    if (synthRef.current) {
      try {
        synthRef.current.resume();
      } catch (e) {
        // some browsers may not support pause/resume well
      }
    }
  };

  const handleVoiceChange = (voiceKey) => {
    setSelectedVoiceKey(voiceKey);
    try {
      if (typeof window !== "undefined") {
        if (voiceKey) {
          localStorage.setItem("preferredVoiceURI", voiceKey);
        } else {
          localStorage.removeItem("preferredVoiceURI");
        }
      }
    } catch (err) {
      // ignore storage errors
    }
  };

  return {
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
  };
}
