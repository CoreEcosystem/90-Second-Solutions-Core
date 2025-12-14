import { Brain } from "lucide-react";

export function ScienceFoundation() {
  return (
    <div className="mt-16 sm:mt-20 text-center">
      <a href="/science" className="group inline-block">
        <div className="bg-[#E6F1EB] dark:bg-[#2F4A5C] rounded-xl border border-[#E6F1EB] dark:border-[#2F4A5C] p-6 sm:p-8 max-w-2xl mx-auto hover:border-[#538890] dark:hover:border-[#538890] transition-all duration-300 ease-out hover:shadow-lg">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-6 h-6 text-[#538890] dark:text-[#538890]" />
            <h2 className="font-roboto-serif font-bold text-xl text-[#538890] dark:text-white/90">
              The Science Behind Emotional Regulation in 90 Seconds
            </h2>
          </div>
          <h3 className="font-montserrat text-sm font-semibold text-[#538890]/80 dark:text-white/80 mb-3">
            Neuroscience-Based Stress Management Techniques
          </h3>
          <p className="font-montserrat text-sm text-[#538890]/70 dark:text-white/70 leading-relaxed mb-4">
            Neuroscience shows that emotions naturally peak and fade within
            about 90 seconds. With the right tools, you can let the wave pass
            instead of getting stuck in it.
          </p>
          <span className="font-montserrat font-semibold text-sm text-[#538890] dark:text-[#538890] group-hover:underline">
            Learn the neuroscience →
          </span>
        </div>
      </a>
    </div>
  );
}
