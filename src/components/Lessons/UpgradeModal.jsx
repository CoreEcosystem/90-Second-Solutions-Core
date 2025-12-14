import { Crown } from "lucide-react";

export function UpgradeModal({ show, onClose }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-8 max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#D3C970] to-[#D3C970]/80 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-[#538890]" />
          </div>
          <h3 className="font-roboto-serif font-bold text-2xl text-[#538890] dark:text-white/90 mb-2">
            Premium required
          </h3>
          <p className="font-montserrat text-base text-[#538890]/70 dark:text-white/70">
            This app is 100% paywalled. Start your 7‑day free trial to unlock
            all lessons and resets.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-[#D3C970]/10 dark:bg-gray-800/30 rounded-lg p-4">
            <h4 className="font-montserrat font-semibold text-sm text-[#538890] dark:text-white/90 mb-2">
              Premium includes:
            </h4>
            <ul className="space-y-1">
              <li className="flex items-center gap-2 font-montserrat text-sm text-[#538890]/80 dark:text-white/80">
                <div className="w-1.5 h-1.5 bg-[#D3C970] rounded-full"></div>
                Unlimited lessons and resets
              </li>
              <li className="flex items-center gap-2 font-montserrat text-sm text-[#538890]/80 dark:text-white/80">
                <div className="w-1.5 h-1.5 bg-[#D3C970] rounded-full"></div>
                Weekly & monthly insights
              </li>
              <li className="flex items-center gap-2 font-montserrat text-sm text-[#538890]/80 dark:text-white/80">
                <div className="w-1.5 h-1.5 bg-[#D3C970] rounded-full"></div>
                Custom values & export data
              </li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 text-[#538890]/70 dark:text-white/70 font-montserrat font-semibold text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            >
              Maybe Later
            </button>
            <a
              href="/profile"
              className="flex-1 bg-[#538890] hover:bg-[#538890]/90 text-white font-montserrat font-semibold text-sm px-4 py-3 rounded-lg transition-all duration-200 text-center flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4" />
              Start 7‑day free trial
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
