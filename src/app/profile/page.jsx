"use client";
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  User,
  Crown,
  Calendar,
  CreditCard,
  Settings,
  Clock,
  ChevronRight,
  Lock,
} from "lucide-react";
import StopwatchIcon from "@/components/StopwatchIcon";
import useUser from "@/utils/useUser";

export default function ProfilePage() {
  const { data: user, loading: userLoading } = useUser();
  const [profile, setProfile] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [usageData, setUsageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [manageLoading, setManageLoading] = useState(false); // added for billing portal
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  // Check for successful checkout
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get("session_id");

      if (sessionId) {
        // Handle successful checkout
        fetch("/api/subscription/success", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        }).then(() => {
          // Clean up URL
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
          // Refresh data
          fetchProfile();
          fetchSubscription();
          fetchUsageData();
        });
      }
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
        setName(data.user?.name || "");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchSubscription = async () => {
    try {
      const response = await fetch("/api/subscription/status");
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    }
  };

  const fetchUsageData = async () => {
    try {
      const response = await fetch("/api/usage/check");
      if (response.ok) {
        const data = await response.json();
        setUsageData(data);
      }
    } catch (error) {
      console.error("Error fetching usage data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userLoading && user) {
      fetchProfile();
      fetchSubscription();
      fetchUsageData();
    }
  }, [userLoading, user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpgrade = async () => {
    setUpgradeLoading(true);
    try {
      const response = await fetch("/api/subscription/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          redirectURL: window.location.href,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.url) {
          window.open(data.url, "_blank", "popup");
        }
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
    } finally {
      setUpgradeLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setManageLoading(true);
    try {
      const response = await fetch("/api/subscription/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ redirectURL: window.location.href }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.url) {
          window.open(data.url, "_blank", "popup");
        }
      } else {
        // fallback: send to upgrade
        await handleUpgrade();
      }
    } catch (error) {
      console.error("Error opening billing portal:", error);
    } finally {
      setManageLoading(false);
    }
  };

  const isPremium = subscription?.is_premium;
  const isTrialing = subscription?.subscription_status === "trialing";

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <StopwatchIcon
            className="w-12 h-12 mx-auto mb-4 animate-pulse"
            color="#538890"
          />
          <p className="font-montserrat text-[#538890] dark:text-white/70">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#121212] flex items-center justify-center">
        <div className="text-center space-y-4">
          <StopwatchIcon className="w-12 h-12 mx-auto" color="#538890" />
          <p className="font-montserrat text-[#538890] dark:text-white/70">
            Please sign in to view your profile
          </p>
          <a href="/account/signin" className="text-[#538890] hover:underline">
            Sign In
          </a>
        </div>
      </div>
    );
  }

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero */}
        <div className="text-center space-y-6 mb-12">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${isPremium ? "bg-gradient-to-br from-[#D3C970] to-[#D3C970]/80" : "bg-gradient-to-br from-[#538890] to-[#538890]/80"}`}
          >
            {isPremium ? (
              <Crown className="w-10 h-10 text-[#538890]" />
            ) : (
              <User className="w-10 h-10 text-white" />
            )}
          </div>

          <div className="space-y-2">
            <h1 className="font-roboto-serif font-light text-3xl sm:text-4xl lg:text-5xl text-[#538890] dark:text-white/90">
              Your Profile
            </h1>
            {isPremium && (
              <p className="font-montserrat text-base text-[#D3C970] font-semibold">
                {isTrialing ? "Premium Trial (7 days)" : "Premium Member"}
              </p>
            )}
          </div>
        </div>

        {/* Usage / Access Section */}
        {isPremium ? (
          usageData && (
            <div className="mb-12 bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#E6F1EB] dark:border-gray-700 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-[#538890]" />
                <h2 className="font-roboto-serif font-bold text-2xl text-[#538890] dark:text-white/90">
                  Your Usage
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#538890]" />
                    <h3 className="font-montserrat font-semibold text-lg text-[#538890] dark:text-white/90">
                      Lessons Completed
                    </h3>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-roboto-serif font-bold text-3xl text-[#538890] dark:text-white/90">
                      {usageData.lessons_completed}
                    </span>
                    <span className="font-montserrat text-base text-[#538890]/70 dark:text-white/70">
                      / unlimited
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items:center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#70A0B2] flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <h3 className="font-montserrat font-semibold text-lg text-[#538890] dark:text-white/90">
                      Resets Completed
                    </h3>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-roboto-serif font-bold text-3xl text-[#538890] dark:text-white/90">
                      {usageData.resets_completed}
                    </span>
                    <span className="font-montserrat text-base text-[#538890]/70 dark:text-white/70">
                      / unlimited
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-[#D3C970]/10 dark:bg-gray-800/30 rounded-lg">
                <p className="font-montserrat text-sm text-[#538890]/80 dark:text-white/80 flex items-center gap-2">
                  <Crown className="w-4 h-4 text-[#D3C970]" />
                  {isTrialing
                    ? "You're on a 7‑day free trial. Enjoy unlimited access."
                    : "Premium member - enjoy unlimited access to all lessons and resets"}
                </p>
              </div>
            </div>
          )
        ) : (
          <div className="mb-12 bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#E6F1EB] dark:border-gray-700 p-8">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-[#538890]" />
              <h2 className="font-roboto-serif font-bold text-2xl text-[#538890] dark:text-white/90">
                Premium required
              </h2>
            </div>
            <p className="font-montserrat text-base text-[#538890]/70 dark:text-white/70 mb-4">
              This app is now 100% paywalled. Start your 7‑day free trial to get
              full access.
            </p>
            <button
              onClick={handleUpgrade}
              disabled={upgradeLoading}
              className="w-full bg-[#538890] hover:bg-[#538890]/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-montserrat font-semibold text-base px-8 py-3 rounded-full transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-2"
            >
              {upgradeLoading ? "Processing..." : "Start 7‑day free trial"}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#E6F1EB] dark:border-gray-700 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-[#538890]" />
              <h2 className="font-roboto-serif font-bold text-2xl text-[#538890] dark:text-white/90">
                Account Details
              </h2>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="space-y-2">
                <label className="block font-montserrat font-semibold text-sm text-[#538890] dark:text-white/80">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 border border-[#E6F1EB] dark:border-gray-600 rounded-lg font-montserrat text-base text-[#538890] dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:border-[#538890] transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-montserrat font-semibold text-sm text-[#538890] dark:text-white/80">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-3 border border-[#E6F1EB] dark:border-gray-600 rounded-lg font-montserrat text-base text-[#538890]/60 dark:text-white/60 bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
                />
                <p className="font-montserrat text-xs text-[#538890]/60 dark:text-white/60">
                  Contact support to change your email address
                </p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-[#538890] hover:bg-[#538890]/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-montserrat font-semibold text-base px-6 py-3 rounded-full transition-all duration-200"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>

          {/* Subscription Status */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#E6F1EB] dark:border-gray-700 p-8">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="w-6 h-6 text-[#538890]" />
              <h2 className="font-roboto-serif font-bold text-2xl text-[#538890] dark:text-white/90">
                Subscription
              </h2>
            </div>

            <div className="space-y-6">
              <div
                className={`p-4 rounded-lg ${isPremium ? "bg-[#D3C970]/20" : "bg-[#E6F1EB]/50"} dark:bg-gray-800/50`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {isPremium ? (
                    <Crown className="w-5 h-5 text-[#D3C970]" />
                  ) : (
                    <User className="w-5 h-5 text-[#538890]" />
                  )}
                  <span className="font-montserrat font-semibold text-base text-[#538890] dark:text-white/90">
                    {isPremium
                      ? isTrialing
                        ? "Premium Trial"
                        : "Premium Plan"
                      : "Free Plan"}
                  </span>
                </div>
                <p className="font-montserrat text-sm text-[#538890]/70 dark:text-white/70">
                  {isPremium
                    ? isTrialing
                      ? "You're on your 7‑day free trial."
                      : "Advanced insights, unlimited custom values, enhanced features"
                    : "Start a free trial to unlock full access"}
                </p>
              </div>

              {subscription?.subscription_end_date && isPremium && (
                <div className="flex items-center gap-3 p-3 bg-[#E6F1EB]/30 dark:bg-gray-800/30 rounded-lg">
                  <Calendar className="w-5 h-5 text-[#538890]" />
                  <div>
                    <p className="font-montserrat text-sm font-semibold text-[#538890] dark:text-white/90">
                      {isTrialing ? "Trial ends on" : "Next billing date"}
                    </p>
                    <p className="font-montserrat text-xs text-[#538890]/70 dark:text-white/70">
                      {new Date(
                        subscription.subscription_end_date,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              {isPremium ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleManageBilling}
                    disabled={manageLoading}
                    className="flex-1 bg-white dark:bg-[#1E1E1E] border border-[#E6F1EB] dark:border-gray-700 hover:border-[#538890] dark:hover:border-[#538890] text-[#538890] dark:text-white font-montserrat font-semibold text-sm px-6 py-3 rounded-full transition-all duration-200"
                  >
                    {manageLoading ? "Opening…" : "Manage billing"}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-[#D3C970]/20 to-[#538890]/20 dark:from-gray-800/30 dark:to-gray-700/30 rounded-lg p-6">
                    <h3 className="font-roboto-serif font-bold text-lg text-[#538890] dark:text-white/90 mb-3">
                      Start your 7‑day free trial
                    </h3>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-center gap-2 font-montserrat text-sm text-[#538890]/80 dark:text-white/80">
                        <div className="w-1.5 h-1.5 bg-[#D3C970] rounded-full"></div>
                        Advanced weekly and monthly insights
                      </li>
                      <li className="flex items-center gap-2 font-montserrat text-sm text-[#538890]/80 dark:text-white/80">
                        <div className="w-1.5 h-1.5 bg-[#D3C970] rounded-full"></div>
                        Unlimited custom values
                      </li>
                      <li className="flex items-center gap-2 font-montserrat text-sm text-[#538890]/80 dark:text:white/80">
                        <div className="w-1.5 h-1.5 bg-[#D3C970] rounded-full"></div>
                        Export your reflection history
                      </li>
                      <li className="flex items-center gap-2 font-montserrat text-sm text-[#538890]/80 dark:text:white/80">
                        <div className="w-1.5 h-1.5 bg-[#D3C970] rounded-full"></div>
                        Priority email support
                      </li>
                    </ul>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-roboto-serif font-bold text-2xl text-[#538890] dark:text-white/90">
                        $9.97
                      </span>
                      <span className="font-montserrat text-sm text-[#538890]/70 dark:text-white/70">
                        /month after trial
                      </span>
                    </div>
                    <p className="font-montserrat text-xs text-[#538890]/60 dark:text:white/60">
                      Cancel anytime. No charge today.
                    </p>
                  </div>

                  <button
                    onClick={handleUpgrade}
                    disabled={upgradeLoading}
                    className="w-full bg-[#538890] hover:bg-[#538890]/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-montserrat font-semibold text-base px-8 py-3 rounded-full transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    {upgradeLoading ? (
                      "Processing..."
                    ) : (
                      <>
                        <Crown className="w-5 h-5" />
                        Start 7‑day free trial
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="mt-12 text-center">
          <a
            href="/account/logout"
            className="font-montserrat text-sm text-[#538890]/70 dark:text:white/70 hover:text-[#538890] dark:hover:text:white transition-all duration-200"
          >
            Sign out of your account
          </a>
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
