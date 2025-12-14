import { emotions } from "@/data/resetStepsData";

export function EmotionPicker({ selectedEmotion, onSelect }) {
  return (
    <div className="space-y-4 mt-6">
      <h4 className="font-roboto-serif font-bold text-lg text-[#0B3A55] dark:text-white/90">
        Select your core emotion
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {emotions.map((e) => {
          const active = selectedEmotion === e.id;
          return (
            <button
              key={e.id}
              type="button"
              onClick={() => onSelect(e.id)}
              className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 border transition-all duration-200 font-montserrat text-sm ${
                active
                  ? "border-[#70A0B2] bg-[#E8F1F4] text-[#0B3A55] dark:bg-[#2A3A44] dark:border-[#70A0B2]"
                  : "border-[#EDF1F5] hover:border-[#70A0B2] text-[#0B3A55] dark:text-white/90 dark:border-gray-700 dark:hover:border-[#70A0B2]"
              }`}
            >
              <span className="text-lg" aria-hidden>
                {e.emoji}
              </span>
              <span>{e.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
