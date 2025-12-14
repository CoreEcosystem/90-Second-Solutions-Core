"use client";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import useAuth from "@/utils/useAuth";
// Add stopwatch icon to mirror signup hero style
import StopwatchIcon from "@/components/StopwatchIcon";

export default function SignInPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signInWithCredentials } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      await signInWithCredentials({
        email,
        password,
        callbackUrl: "/",
        redirect: true,
      });
    } catch (err) {
      const errorMessages = {
        OAuthSignin:
          "Couldn't start sign-in. Please try again or use a different method.",
        OAuthCallback: "Sign-in failed after redirecting. Please try again.",
        OAuthCreateAccount:
          "Couldn't create an account with this sign-in method. Try another option.",
        EmailCreateAccount:
          "This email can't be used to create an account. It may already exist.",
        Callback: "Something went wrong during sign-in. Please try again.",
        OAuthAccountNotLinked:
          "This account is linked to a different sign-in method. Try using that instead.",
        CredentialsSignin:
          "Incorrect email or password. Try again or reset your password.",
        AccessDenied: "You don't have permission to sign in.",
        Configuration:
          "Sign-in isn't working right now. Please try again later.",
        Verification: "Your sign-in link has expired. Request a new one.",
      };

      setError(
        errorMessages[err.message] || "Something went wrong. Please try again.",
      );
      setLoading(false);
    }
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
        <div className="w-full max-w-md space-y-8">
          {/* Hero */}
          <div className="text-center space-y-6">
            {/* Mirror signup's hero badge style */}
            <div className="w-20 h-20 bg-gradient-to-br from-[#D3C970] to-[#D3C970]/80 rounded-full flex items-center justify-center mx-auto">
              <StopwatchIcon className="w-10 h-10" color="#538890" />
            </div>

            <h1 className="font-roboto-serif font-light text-3xl sm:text-4xl text-[#538890] dark:text-white/90">
              Already using 90-Second Solutions?
            </h1>

            <p className="font-montserrat text-base text-[#538890]/70 dark:text-white/70 leading-relaxed">
              Access saved sessions, lessons, and progress.
            </p>
          </div>

          {/* Sign In Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block font-montserrat font-semibold text-sm text-[#538890] dark:text-white/80">
                  Email
                </label>
                <input
                  required
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-[#E6F1EB] dark:border-gray-600 rounded-lg font-montserrat text-base text-[#538890] dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:border-[#538890] transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-montserrat font-semibold text-sm text-[#538890] dark:text-white/80">
                    Password
                  </label>
                  <a
                    href="/account/reset-password"
                    className="font-montserrat text-xs text-[#538890] dark:text-white/70 hover:text-[#538890]/80 dark:hover:text-white transition-all duration-200"
                  >
                    Forgot password?
                  </a>
                </div>
                <input
                  required
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E6F1EB] dark:border-gray-600 rounded-lg font-montserrat text-base text-[#538890] dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:border-[#538890] transition-all duration-200"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="font-montserrat text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* Group button + reassurance + link to mirror signup layout */}
            <div className="space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#538890] hover:bg-[#538890]/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-montserrat font-semibold text-base px-8 py-3 rounded-full transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg"
              >
                {loading
                  ? "Signing in..."
                  : "Sign In to Continue Your Practice"}
              </button>

              {/* Tiny reassurance line */}
              <p className="font-montserrat text-xs text-center text-[#538890]/50 dark:text-white/50 leading-relaxed">
                No spam. Cancel anytime.
              </p>

              <p className="text-center font-montserrat text-sm text-[#538890]/70 dark:text-white/70">
                Don't have an account?{" "}
                <a
                  href={`/account/signup${typeof window !== "undefined" ? window.location.search : ""}`}
                  className="text-[#538890] dark:text-white font-semibold hover:text-[#538890]/80 dark:hover:text-white/80 transition-all duration-200"
                >
                  Sign up
                </a>
              </p>
            </div>
          </form>
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
