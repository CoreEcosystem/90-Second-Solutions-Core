import { Play, Lock } from "lucide-react";
import { VoiceControls } from "./VoiceControls";

export function PreparePhase({
  onStart,
  isLocked,
  tracking,
  speechSupported,
  voiceEnabled,
  setVoiceEnabled,
  voices,
  selectedVoiceKey,
  preferredVoice,
  onVoiceChange,
}) {
  return (
    <div className="text-center space-y-8">
      {/* Primary prompt */}
      <div className="space-y-4">
        <h2 className="font-roboto-serif font-light text-3xl sm:text-4xl text-[#0B3A55] dark:text-white/90">
          Take a moment.
        </h2>
        <p className="font-montserrat text-base text-[#557082] dark:text-white/70 leading-relaxed max-w-lg mx-auto">
          You don’t need to change anything — just notice.
        </p>
      </div>

      {/* Support copy */}
      <p className="font-montserrat text-sm sm:text-base text-[#557082] dark:text-white/70 leading-relaxed max-w-lg mx-auto">
        This is not meditation. There’s nothing to fix, force, or control.
      </p>

      {/* Voice toggle hint (shows if unsupported) */}
      {!speechSupported && (
        <div className="mb-4 text-center font-montserrat text-sm text-[#557082] dark:text-white/70">
          Voice guidance isn't supported by this browser. You can still use the
          reset.
        </div>
      )}

      <VoiceControls
        voiceEnabled={voiceEnabled}
        setVoiceEnabled={setVoiceEnabled}
        speechSupported={speechSupported}
        voices={voices}
        selectedVoiceKey={selectedVoiceKey}
        preferredVoice={preferredVoice}
        onVoiceChange={onVoiceChange}
        pickerId="voice-picker"
      />

      {/* Expectation setting card */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#EDF1F5] dark:border-gray-700 p-8 space-y-4 max-w-lg mx-auto">
        <h3 className="font-roboto-serif font-bold text-lg sm:text-xl text-[#0B3A55] dark:text-white/90">
          What to expect
        </h3>
        <p className="font-montserrat text-sm sm:text-base text-[#557082] dark:text-white/70 leading-relaxed">
          For the next 90 seconds, your only job is to let your body do what
          it’s designed to do.
        </p>
      </div>

      <button
        onClick={onStart}
        disabled={isLocked || tracking}
        className={`font-montserrat font-semibold text-lg px-12 py-4 rounded-full transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-xl flex items-center gap-3 mx-auto ${
          isLocked
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#70A0B2] hover:bg-[#5C94B0] text-white"
        }`}
      >
        {tracking ? (
          "Starting..."
        ) : isLocked ? (
          <>
            <Lock className="w-6 h-6" />
            Upgrade to Continue
          </>
        ) : (
          <>
            <Play className="w-6 h-6" />
            Begin 90-Second Reset
          </>
        )}
      </button>

      {/* Optional secondary copy */}
      <p className="font-montserrat text-xs text-[#557082] dark:text-white/60 max-w-md mx-auto">
        You can stop at any time.
      </p>
    </div>
  );
}
