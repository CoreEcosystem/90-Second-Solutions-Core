import { Zap } from "lucide-react";

export function ResetCallToAction() {
  return (
    <div className="mt-16 text-center space-y-6">
      <h3 className="font-roboto-serif font-bold text-2xl text-[#538890] dark:text-white/90">
        Need to reset first?
      </h3>

      <p className="font-montserrat text-base text-[#538890]/70 dark:text-white/70 max-w-md mx-auto">
        If you're feeling triggered or reactive, try a 90-second reset before
        diving into lessons.
      </p>

      <a
        href="/reset"
        className="bg-[#538890] hover:bg-[#538890]/90 text-white font-montserrat font-semibold text-base px-8 py-3 rounded-full transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg flex items-center gap-2 justify-center mx-auto max-w-fit"
      >
        <Zap className="w-5 h-5" />
        Try a Reset First
      </a>
    </div>
  );
}
