"use client";
import { ChevronLeft } from "lucide-react";
import StopwatchIcon from "@/components/StopwatchIcon";
import useAuth from "@/utils/useAuth";

export default function LogoutPage() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

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
              Back to Home
            </a>
            <img
              src="https://ucarecdn.com/3cfbf65a-b402-47be-8ba6-2041dda41592/-/format/auto/"
              alt="90-Second Solutions"
              className="h-10 w-auto"
            />
            <div className="w-[120px]"></div> {/* Spacer for centering */}
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-[#538890]/20 to-[#538890]/40 rounded-full flex items-center justify-center mx-auto">
            <StopwatchIcon className="w-10 h-10" color="#538890" />
          </div>

          {/* Content */}
          <div className="space-y-6">
            <h1 className="font-roboto-serif font-light text-3xl sm:text-4xl text-[#538890] dark:text-white/90">
              Ready to sign out?
            </h1>

            <p className="font-montserrat text-base text-[#538890]/70 dark:text-white/70 leading-relaxed">
              You can return anytime to continue your practice of intentional
              living
            </p>
          </div>

          {/* Action */}
          <div className="space-y-4">
            <button
              onClick={handleSignOut}
              className="w-full bg-[#538890] hover:bg-[#538890]/90 text-white font-montserrat font-semibold text-base px-8 py-3 rounded-full transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg"
            >
              Sign Out
            </button>

            <a
              href="/"
              className="block font-montserrat text-sm text-[#538890] dark:text-white hover:text-[#538890]/80 dark:hover:text-white/80 transition-all duration-200"
            >
              Never mind, take me home
            </a>
          </div>
        </div>
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
