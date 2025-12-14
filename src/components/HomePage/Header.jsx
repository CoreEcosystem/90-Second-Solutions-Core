import { Crown, User } from "lucide-react";

export function Header({ user, userLoading, isPremium }) {
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#121212] border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex items-center justify-between h-16 lg:h-16">
          {/* Mobile: Logo First */}
          <div className="lg:hidden">
            <img
              src="https://ucarecdn.com/3cfbf65a-b402-47be-8ba6-2041dda41592/-/format/auto/"
              alt="90-Second Solutions"
              className="h-10 w-auto"
            />
          </div>

          {/* Desktop: Left Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {/* ADDED: Welcome link */}
            <a
              href="/welcome"
              className="font-montserrat font-semibold text-base text-[#538890]/85 dark:text-white/85 hover:text-[#538890] dark:hover:text-white hover:underline hover:decoration-[#538890] dark:hover:decoration-white hover:decoration-2 hover:underline-offset-4 transition-all duration-200"
            >
              Welcome
            </a>
            {/* Existing links remain the same */}
            <a
              href="/reset"
              className="font-montserrat font-semibold text-base text-[#538890]/85 dark:text-white/85 hover:text-[#538890] dark:hover:text-white hover:underline hover:decoration-[#538890] dark:hover:decoration-white hover:decoration-2 hover:underline-offset-4 transition-all duration-200"
            >
              90-Second Reset
            </a>
            <a
              href="/lessons"
              className="font-montserrat font-semibold text-base text-[#538890]/85 dark:text-white/85 hover:text-[#538890] dark:hover:text-white hover:underline hover:decoration-[#538890] dark:hover:decoration-white hover:decoration-2 hover:underline-offset-4 transition-all duration-200"
            >
              90-Second Lessons
            </a>
            <a
              href="/science"
              className="font-montserrat font-semibold text-base text-[#538890]/85 dark:text-white/85 hover:text-[#538890] dark:hover:text-white hover:underline hover:decoration-[#538890] dark:hover:decoration-white hover:decoration-2 hover:underline-offset-4 transition-all duration-200"
            >
              The Science
            </a>
          </div>

          {/* Desktop: Center Logo */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2">
            <img
              src="https://ucarecdn.com/3cfbf65a-b402-47be-8ba6-2041dda41592/-/format/auto/"
              alt="90-Second Solutions"
              className="h-12 w-auto"
            />
          </div>

          {/* Mobile: Auth or Menu */}
          <div className="lg:hidden">
            {!userLoading ? (
              user ? (
                <a
                  href="/profile"
                  className="flex items-center gap-2 font-montserrat font-semibold text-sm text-[#538890]/85 dark:text-white/85 hover:text-[#538890] dark:hover:text-white px-3 py-2 border border-[#538890]/20 dark:border-white/20 rounded-md transition-all duration-200"
                >
                  {isPremium ? (
                    <Crown className="w-4 h-4 text-[#D3C970]" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  Profile
                </a>
              ) : (
                <a
                  href="/account/signin"
                  className="font-montserrat font-semibold text-sm text-[#538890]/85 dark:text-white/85 hover:text-[#538890] dark:hover:text-white hover:border-[#538890]/40 dark:hover:border-white/40 px-3 py-2 border border-[#538890]/20 dark:border-white/20 rounded-md transition-all duration-200"
                >
                  Sign In
                </a>
              )
            ) : (
              <div className="px-3 py-2">
                <div className="w-5 h-5 animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            )}
          </div>

          {/* Desktop: Right Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {user ? (
              <>
                <a
                  href="/reflection"
                  className="font-montserrat font-semibold text-base text-[#538890]/85 dark:text-white/85 hover:text-[#538890] dark:hover:text-white hover:underline hover:decoration-[#538890] dark:hover:decoration-white hover:decoration-2 hover:underline-offset-4 transition-all duration-200"
                >
                  Reflection
                </a>
                <span className="text-gray-300 dark:text-gray-700">•</span>
                <a
                  href="/insights"
                  className="font-montserrat font-semibold text-base text-[#538890]/85 dark:text-white/85 hover:text-[#538890] dark:hover:text-white hover:underline hover:decoration-[#538890] dark:hover:decoration-white hover:decoration-2 hover:underline-offset-4 transition-all duration-200"
                >
                  Your Insights
                </a>
                <a
                  href="/profile"
                  className="flex items-center gap-2 font-montserrat font-semibold text-base text-[#538890]/85 dark:text-white/85 hover:text-[#538890] dark:hover:text-white px-4 py-2 border border-[#538890]/20 dark:border-white/20 rounded-full hover:border-[#538890]/40 dark:hover:border-white/40 transition-all duration-200"
                >
                  {isPremium ? (
                    <>
                      <Crown className="w-4 h-4 text-[#D3C970]" />
                      {user.name || user.email}
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4" />
                      {user.name || user.email}
                    </>
                  )}
                </a>
              </>
            ) : (
              <>
                <a
                  href="/account/signin"
                  className="font-montserrat font-semibold text-base text-[#538890]/85 dark:text-white/85 hover:text-[#538890] dark:hover:text-white hover:underline hover:decoration-[#538890] dark:hover:decoration-white hover:decoration-2 hover:underline-offset-4 transition-all duration-200"
                >
                  Sign In
                </a>
                <a
                  href="/reset"
                  className="bg-[#538890] hover:bg-[#538890]/90 text-white font-montserrat font-semibold text-base px-6 py-2 rounded-full transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg"
                >
                  Try a 90-Second Reset
                </a>
              </>
            )}
          </div>
        </nav>

        {/* Mobile: Secondary Links (Reflection + Your Insights) */}
        {!userLoading && user ? (
          <div className="lg:hidden py-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-center gap-4">
            <a
              href="/reflection"
              className="font-montserrat font-semibold text-sm text-[#538890]/85 dark:text-white/85 hover:text-[#538890] dark:hover:text-white hover:underline hover:decoration-[#538890] dark:hover:decoration-white hover:underline-offset-4 transition-all duration-200"
            >
              Reflection
            </a>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <a
              href="/insights"
              className="font-montserrat font-semibold text-sm text-[#538890]/85 dark:text-white/85 hover:text-[#538890] dark:hover:text-white hover:underline hover:decoration-[#538890] dark:hover:decoration-white hover:underline-offset-4 transition-all duration-200"
            >
              Your Insights
            </a>
          </div>
        ) : null}
      </div>
    </header>
  );
}
