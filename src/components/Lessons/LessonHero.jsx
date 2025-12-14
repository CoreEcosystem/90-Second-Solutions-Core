import { Clock } from "lucide-react";

export function LessonHero() {
  return (
    <div className="text-center space-y-6 mb-12">
      <div className="w-20 h-20 bg-gradient-to-br from-[#D3C970] to-[#D3C970]/80 rounded-full flex items-center justify-center mx-auto">
        <Clock className="w-10 h-10 text-[#538890]" />
      </div>

      <div className="space-y-3">
        <h1 className="font-roboto-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-[#538890] dark:text-white/90">
          90-Second Lessons
        </h1>

        <p className="font-montserrat font-semibold text-lg text-[#538890]/80 dark:text-white/80">
          Understand What's Happening in Your Brain
        </p>
      </div>

      <p className="font-montserrat text-base sm:text-lg text-[#538890]/70 dark:text-white/70 leading-relaxed max-w-2xl mx-auto">
        Short, practical lessons that explain <em>why</em> your emotions hijack
        your thinking — and how to regain control faster next time.
      </p>

      <ul className="space-y-2 max-w-xl mx-auto text-left">
        <li className="font-montserrat text-sm text-[#538890]/70 dark:text-white/70 flex items-start gap-2">
          <span className="text-[#D3C970] dark:text-[#D3C970] mt-0.5">•</span>
          <span>Learn why emotions peak and pass in ~90 seconds</span>
        </li>
        <li className="font-montserrat text-sm text-[#538890]/70 dark:text-white/70 flex items-start gap-2">
          <span className="text-[#D3C970] dark:text-[#D3C970] mt-0.5">•</span>
          <span>Build emotional literacy and self-awareness</span>
        </li>
        <li className="font-montserrat text-sm text-[#538890]/70 dark:text-white/70 flex items-start gap-2">
          <span className="text-[#D3C970] dark:text-[#D3C970] mt-0.5">•</span>
          <span>Apply neuroscience without overwhelm</span>
        </li>
      </ul>
    </div>
  );
}
