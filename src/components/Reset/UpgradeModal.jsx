import { RotateCcw, Crown } from "lucide-react";

export function UpgradeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-8 max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#70A0B2] to-[#5C94B0] rounded-full flex items-center justify-center mx-auto mb-4">
            <RotateCcw className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-roboto-serif font-bold text-2xl text-[#0B3A55] dark:text-white/90 mb-2">
            Premium required
          </h3>
          <p className="font-montserrat text-base text-[#557082] dark:text-white/70">
            This app is 100% paywalled. Start your 7‑day free trial to unlock
            all resets and lessons.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-[#70A0B2]/10 dark:bg-gray-800/30 rounded-lg p-4">
            <h4 className="font-montserrat font-semibold text-sm text-[#0B3A55] dark:text-white/90 mb-2">
              Premium includes:
            </h4>
            <ul className="space-y-1">
              <li className="flex items-center gap-2 font-montserrat text-sm text-[#557082] dark:text-white/80">
                <div className="w-1.5 h-1.5 bg-[#70A0B2] rounded-full"></div>
                Unlimited lessons and resets
              </li>
              <li className="flex items-center gap-2 font-montserrat text-sm text-[#557082] dark:text-white/80">
                <div className="w-1.5 h-1.5 bg-[#70A0B2] rounded-full"></div>
                Weekly & monthly insights
              </li>
              <li className="flex items-center gap-2 font-montserrat text-sm text-[#557082] dark:text-white/80">
                <div className="w-1.5 h-1.5 bg-[#70A0B2] rounded-full"></div>
                Custom values & export data
              </li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 text-[#557082] dark:text-white/70 font-montserrat font-semibold text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            >
              Maybe Later
            </button>
            <a
              href="/profile"
              className="flex-1 bg-[#70A0B2] hover:bg-[#5C94B0] text-white font-montserrat font-semibold text-sm px-4 py-3 rounded-lg transition-all duration-200 text-center flex items-center justify-center gap-2"
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
