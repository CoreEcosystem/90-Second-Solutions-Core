import { Crown, Lock } from "lucide-react";

export function UsageStatsBar({ usageData, user }) {
  if (!usageData || usageData.is_premium || !user) {
    return null;
  }

  // Fully paywalled: show a premium-required banner instead of progress bars
  return (
    <div className="mb-8 bg-gradient-to-r from-[#538890]/5 to-[#D3C970]/10 dark:from-gray-800/50 dark:to-gray-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Lock className="w-5 h-5 text-[#538890]" />
          <h3 className="font-roboto-serif font-bold text-lg text-[#538890] dark:text-white/90">
            Premium required
          </h3>
        </div>
        <a
          href="/profile"
          className="flex items-center gap-2 text-[#538890] hover:text-[#D3C970] font-montserrat font-semibold text-sm transition-colors"
        >
          <Crown className="w-4 h-4" />
          Start 7‑day free trial
        </a>
      </div>
      <p className="mt-2 font-montserrat text-sm text-[#538890]/70 dark:text-white/70">
        This app is 100% paywalled. Unlock all lessons with a free trial.
      </p>
    </div>
  );
}
