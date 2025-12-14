export function VoiceControls({
  voiceEnabled,
  setVoiceEnabled,
  speechSupported,
  voices,
  selectedVoiceKey,
  preferredVoice,
  onVoiceChange,
  showPicker = true,
  pickerId = "voice-picker",
}) {
  const getVoiceKey = (v) => v.voiceURI || `${v.name}|${v.lang}`;

  const voicePriority = (v) => {
    const lang = (v.lang || "").toLowerCase();
    if (lang.startsWith("en-us")) return 0;
    if (lang.startsWith("en")) return 1;
    return 2;
  };

  const sortedVoices =
    voices && voices.length
      ? [...voices].sort((a, b) => {
          const pa = voicePriority(a);
          const pb = voicePriority(b);
          if (pa !== pb) return pa - pb;
          return (a.name || "").localeCompare(b.name || "");
        })
      : [];

  const voiceValue =
    selectedVoiceKey || (preferredVoice ? getVoiceKey(preferredVoice) : "");

  return (
    <div className="space-y-3">
      {/* Voice toggle */}
      <div className="flex items-center justify-center gap-3">
        <span className="font-montserrat text-sm text-[#557082] dark:text-white/70">
          Voice guidance
        </span>
        <button
          type="button"
          onClick={() => setVoiceEnabled((v) => !v)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
            voiceEnabled ? "bg-[#70A0B2]" : "bg-gray-300 dark:bg-gray-700"
          }`}
          aria-pressed={voiceEnabled}
          aria-label="Toggle voice guidance"
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
              voiceEnabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Voice picker */}
      {showPicker && (
        <div className="flex items-center justify-center gap-3">
          <label
            className="font-montserrat text-sm text-[#557082] dark:text-white/70"
            htmlFor={pickerId}
          >
            Voice
          </label>
          <select
            id={pickerId}
            value={voiceValue}
            onChange={(e) => onVoiceChange(e.target.value)}
            disabled={!speechSupported || sortedVoices.length === 0}
            className="font-montserrat text-sm border border-[#EDF1F5] dark:border-gray-700 rounded-md px-2 py-1 bg-white dark:bg-[#1E1E1E] text-[#0B3A55] dark:text-white/90 min-w-[240px]"
            aria-label="Select voice for guidance"
          >
            <option value="">
              {sortedVoices.length === 0 ? "Loading voices…" : "Default (auto)"}
            </option>
            {sortedVoices.map((v) => {
              const key = getVoiceKey(v);
              const label = `${v.name} (${v.lang})`;
              return (
                <option key={key} value={key}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>
      )}
    </div>
  );
}
