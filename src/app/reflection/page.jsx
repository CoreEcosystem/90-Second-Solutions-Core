"use client";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { ChevronLeft, Check } from "lucide-react";
import StopwatchIcon from "@/components/StopwatchIcon";
import useUser from "@/utils/useUser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function ReflectionPage() {
  const { data: user, loading: userLoading } = useUser();
  const queryClient = useQueryClient();

  // Journal state
  const [journalingText, setJournalingText] = useState("");
  const [feelings, setFeelings] = useState([]); // array of strings
  const [energy, setEnergy] = useState(3); // 1..5
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Prompt chips
  const prompts = useMemo(
    () => [
      "What changed for me after the reset?",
      "What do I need next?",
      "What would make things 1% better?",
    ],
    [],
  );

  const feelingOptions = useMemo(
    () => ["Calm", "Tense", "Focused", "Drained", "Grateful"],
    [],
  );

  // Load today's reflection
  const {
    data: todayData,
    isLoading: todayLoading,
    error: todayError,
  } = useQuery({
    queryKey: ["reflection", "today"],
    queryFn: async () => {
      const res = await fetch("/api/reflection/today");
      if (!res.ok) {
        throw new Error(
          `When fetching /api/reflection/today, the response was [${res.status}] ${res.statusText}`,
        );
      }
      return res.json();
    },
    enabled: !!user && !userLoading,
  });

  // Load recent reflections for the sidebar list
  const { data: recentData } = useQuery({
    queryKey: ["reflection", "recent"],
    queryFn: async () => {
      const res = await fetch("/api/reflection/recent");
      if (!res.ok) {
        throw new Error(
          `When fetching /api/reflection/recent, the response was [${res.status}] ${res.statusText}`,
        );
      }
      return res.json();
    },
    enabled: !!user && !userLoading,
  });

  // Initialize form state from today's reflection once
  const hasMountedRef = useRef(false);
  useEffect(() => {
    if (todayData?.reflection) {
      const r = todayData.reflection;
      setJournalingText(r.journaling_text || r.micro_action || "");
      try {
        setFeelings(Array.isArray(r.feelings) ? r.feelings : []);
      } catch {
        setFeelings([]);
      }
      setEnergy(typeof r.energy === "number" ? r.energy : 3);
    }
    // mark mounted after first load attempt
    hasMountedRef.current = true;
  }, [todayData]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch("/api/reflection/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Save failed: [${res.status}] ${text}`);
      }
      return res.json();
    },
    onSuccess: () => {
      setLastSavedAt(Date.now());
      setSaveError(null);
      // Refresh caches
      queryClient.invalidateQueries({ queryKey: ["reflection", "today"] });
      queryClient.invalidateQueries({ queryKey: ["reflection", "recent"] });
    },
    onError: (err) => {
      console.error(err);
      setSaveError("Could not save your entry. Please try again.");
    },
    onSettled: () => setSaving(false),
  });

  // Autosave with debounce (only when user has typed or selected feelings)
  useEffect(() => {
    if (!user || userLoading) return;
    if (!hasMountedRef.current) return;
    const hasContent = journalingText.trim().length > 0 || feelings.length > 0; // avoid saving for energy only
    if (!hasContent) return;

    setSaving(true);
    const t = setTimeout(() => {
      saveMutation.mutate({
        journalingText: journalingText.trim(),
        microAction: "",
        selectedValues: [],
        feelings,
        energy,
      });
    }, 1200);

    return () => clearTimeout(t);
  }, [journalingText, feelings, energy, user, userLoading]);

  const handleSaveNow = useCallback(() => {
    setSaving(true);
    saveMutation.mutate({
      journalingText: journalingText.trim(),
      microAction: "",
      selectedValues: [],
      feelings,
      energy,
    });
  }, [journalingText, feelings, energy, saveMutation]);

  const handleSaveAndInsights = useCallback(() => {
    setSaving(true);
    saveMutation.mutate(
      {
        journalingText: journalingText.trim(),
        microAction: "",
        selectedValues: [],
        feelings,
        energy,
      },
      {
        onSuccess: () => {
          if (typeof window !== "undefined") {
            window.location.href = "/insights";
          }
        },
      },
    );
  }, [journalingText, feelings, energy, saveMutation]);

  const toggleFeeling = (f) => {
    setFeelings((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f],
    );
  };

  const addPrompt = (p) => {
    setJournalingText((prev) => (prev ? `${prev}\n\n${p}` : p));
  };

  // Show loading state while auth or first fetch
  if (userLoading || todayLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <StopwatchIcon
            className="w-12 h-12 mx-auto mb-4 animate-pulse"
            color="#538890"
          />
          <p className="font-montserrat text-[#538890] dark:text-white/70">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Show sign in prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#121212] flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <div className="w-20 h-20 bg-gradient-to-br from-[#538890] to-[#538890]/80 rounded-full flex items-center justify-center mx-auto">
            <StopwatchIcon className="w-10 h-10" color="white" />
          </div>

          <h2 className="font-roboto-serif font-bold text-2xl sm:text-3xl text-[#538890] dark:text-white/90">
            Sign in to continue
          </h2>

          <p className="font-montserrat text-base text-[#538890]/70 dark:text-white/70">
            Create an account or sign in to save your reflections and track your
            progress
          </p>

          <div className="flex gap-4 justify-center">
            <a
              href="/account/signup"
              className="bg-[#538890] hover:bg-[#538890]/90 text-white font-montserrat font-semibold text-base px-6 py-3 rounded-full transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg"
            >
              Get Started
            </a>
            <a
              href="/account/signin"
              className="border border-[#538890]/30 text-[#538890] dark:text-white font-montserrat font-semibold text-base px-6 py-3 rounded-full hover:border-[#538890] transition-all duration-200"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-[#121212] border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center justify-between h-16">
            <a
              href="/"
              className="flex items-center gap-2 font-montserrat font-semibold text-base text-[#538890]/85 dark:text-white/85 hover:text-[#538890] dark:hover:text-white transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
              Home
            </a>
            <img
              src="https://ucarecdn.com/3cfbf65a-b402-47be-8ba6-2041dda41592/-/format/auto/"
              alt="90-Second Solutions"
              className="h-10 w-auto"
            />

            {/* Save status */}
            <div className="flex items-center gap-2">
              {saving ? (
                <span className="font-montserrat text-xs text-[#538890]/70 dark:text-white/70">
                  Saving…
                </span>
              ) : lastSavedAt ? (
                <span className="font-montserrat text-xs text-[#538890]/70 dark:text-white/70">
                  Saved just now
                </span>
              ) : (
                <span className="font-montserrat text-xs text-transparent">
                  &nbsp;
                </span>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Main */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <h2 className="font-roboto-serif font-bold text-2xl sm:text-3xl text-[#538890] dark:text-white/90">
              Journal about your reset
            </h2>
            <p className="font-montserrat text-sm text-[#538890]/70 dark:text-white/70">
              Take a minute to write what feels true right now. Only you can see
              this.
            </p>
          </div>

          {/* Prompt chips */}
          <div className="flex flex-wrap gap-2">
            {prompts.map((p) => (
              <button
                key={p}
                onClick={() => addPrompt(p)}
                className="px-3 py-1 rounded-full border border-[#538890]/30 text-[#538890] dark:text-white font-montserrat text-sm hover:border-[#538890] transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Journal box */}
          <div className="space-y-2">
            <textarea
              value={journalingText}
              onChange={(e) => setJournalingText(e.target.value)}
              rows={10}
              placeholder="Write what feels true right now…"
              className="w-full px-4 py-3 border border-[#E6F1EB] dark:border-gray-600 rounded-lg font-montserrat text-base text-[#538890] dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:border-[#538890] resize-y min-h-[160px]"
              maxLength={3000}
            />
            <div className="flex items-center justify-between">
              <p className="font-montserrat text-xs text-[#538890]/60 dark:text-white/60">
                {journalingText.length}/3000
              </p>
              {saveError ? (
                <p className="font-montserrat text-xs text-red-600 dark:text-red-400">
                  {saveError}
                </p>
              ) : null}
            </div>
          </div>

          {/* Feelings & Energy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="font-montserrat text-sm font-semibold text-[#538890]/80 dark:text-white/80 mb-2">
                Feelings (optional)
              </h3>
              <div className="flex flex-wrap gap-2">
                {feelingOptions.map((f) => (
                  <button
                    key={f}
                    onClick={() => toggleFeeling(f)}
                    className={
                      `px-3 py-1 rounded-full border font-montserrat text-sm transition-colors ` +
                      (feelings.includes(f)
                        ? "bg-[#538890] border-[#538890] text-white"
                        : "border-[#538890]/30 text-[#538890] dark:text-white hover:border-[#538890]")
                    }
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-montserrat text-sm font-semibold text-[#538890]/80 dark:text-white/80 mb-2">
                Energy (1–5)
              </h3>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={energy}
                  onChange={(e) => setEnergy(Number(e.target.value))}
                  className="w-full"
                />
                <span className="w-8 text-center font-montserrat text-sm text-[#538890] dark:text-white/90">
                  {energy}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handleSaveNow}
              className="bg-[#538890] hover:bg-[#538890]/90 text-white font-montserrat font-semibold text-base px-6 py-3 rounded-full transition-all duration-200"
              disabled={saving}
            >
              {saving ? "Saving…" : "Save Entry"}
            </button>
            <button
              onClick={handleSaveAndInsights}
              className="border border-[#538890]/30 text-[#538890] dark:text-white font-montserrat font-semibold text-base px-6 py-3 rounded-full hover:border-[#538890] transition-all duration-200"
              disabled={saving}
            >
              Save & View Insights
            </button>
          </div>
        </div>

        {/* Right/Sidebar */}
        <aside className="lg:col-span-1 space-y-4">
          <h3 className="font-montserrat text-sm font-semibold text-[#538890]/80 dark:text-white/80">
            Recent entries
          </h3>
          <div className="space-y-3">
            {recentData?.reflections?.length ? (
              recentData.reflections.map((r) => {
                const firstLine = (
                  r.journaling_text ||
                  r.micro_action ||
                  ""
                ).split("\n")[0];
                return (
                  <div
                    key={r.id}
                    className="p-3 rounded-md border border-[#E6F1EB] dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-montserrat text-xs text-[#538890]/70 dark:text-white/70">
                        {r.reflection_date}
                      </span>
                      {typeof r.energy === "number" ? (
                        <span className="font-montserrat text-xs text-[#538890]/80 dark:text-white/80">
                          Energy: {r.energy}
                        </span>
                      ) : null}
                    </div>
                    <p
                      className="mt-1 font-montserrat text-sm text-[#538890] dark:text-white/90 overflow-hidden text-ellipsis"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {firstLine || "(No text)"}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="font-montserrat text-sm text-[#538890]/60 dark:text-white/60">
                No recent entries yet.
              </p>
            )}
          </div>
        </aside>
      </div>

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
