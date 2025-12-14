"use client";
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  Mail,
  MessageSquare,
  HelpCircle,
  CreditCard,
  LogIn,
  Clock,
  CheckCircle,
  X as CloseIcon,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("General");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);
  const [ticketId, setTicketId] = useState(null);
  // added: manage billing loading state
  const [manageLoading, setManageLoading] = useState(false);
  // new: show a short success banner after send
  const [showBanner, setShowBanner] = useState(false);

  // New: send to backend which stores + emails via Resend
  const sendMutation = useMutation({
    mutationFn: async ({ name, email, topic, message }) => {
      const response = await fetch("/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, topic, message }),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          `When fetching /api/contact/submit, the response was [${response.status}] ${response.statusText}: ${text}`,
        );
      }
      return response.json();
    },
    onSuccess: (data) => {
      setSent(true);
      setTicketId(data?.id || null);
      setShowBanner(true); // show the top banner after successful send
    },
    onError: (err) => {
      console.error(err);
      setError(
        "We couldn't send your message right now. You can try again or email us directly at support@90secondsolutions.com.",
      );
    },
  });

  // Optional: auto-hide banner after a few seconds
  useEffect(() => {
    if (showBanner) {
      const t = setTimeout(() => setShowBanner(false), 6000);
      return () => clearTimeout(t);
    }
  }, [showBanner]);

  const onSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !message) {
      setError("Please include your email and a short message.");
      return;
    }

    sendMutation.mutate({ name, email, topic, message });
  };

  // added: manage billing handler
  const handleManageBilling = async () => {
    try {
      setManageLoading(true);
      const response = await fetch("/api/subscription/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          redirectURL:
            typeof window !== "undefined" ? window.location.href : "/profile",
        }),
      });
      if (!response.ok) {
        throw new Error(
          `When fetching /api/subscription/portal, the response was [${response.status}] ${response.statusText}`,
        );
      }
      const data = await response.json();
      if (data?.url && typeof window !== "undefined") {
        window.open(data.url, "_blank", "popup");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setManageLoading(false);
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
            <div className="w-[120px]"></div>
          </nav>
        </div>
      </header>

      {/* Success banner */}
      {showBanner && (
        <div className="bg-[#E6F1EB] dark:bg-[#0F2E35] border-b border-[#CFE3DA] dark:border-gray-800">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#2F5C68] dark:text-white/80" />
              <p className="font-montserrat text-sm text-[#2F5C68] dark:text-white/80">
                We got your message{ticketId ? ` (ref #${ticketId})` : ""}.
                We'll reply to {email} shortly.
              </p>
            </div>
            <button
              aria-label="Dismiss"
              onClick={() => setShowBanner(false)}
              className="p-1 rounded hover:bg-white/40 dark:hover:bg-white/10 transition"
            >
              <CloseIcon className="w-4 h-4 text-[#2F5C68] dark:text-white/70" />
            </button>
          </div>
        </div>
      )}

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Hero */}
        <div className="text-center space-y-5 mb-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#538890] to-[#538890]/80 flex items-center justify-center mx-auto">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="font-roboto-serif font-light text-3xl sm:text-4xl text-[#538890] dark:text-white/90">
              Contact / Support
            </h1>
            <p className="font-montserrat text-base text-[#538890]/70 dark:text-white/70">
              We’re here to help with access, billing, or product questions.
            </p>
          </div>
        </div>

        {/* Contact options */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#E6F1EB] dark:border-gray-700 p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-6 h-6 text-[#538890]" />
            <h2 className="font-roboto-serif font-bold text-2xl text-[#538890] dark:text-white/90">
              Send us a note
            </h2>
          </div>
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block font-montserrat font-semibold text-sm text-[#538890] dark:text-white/80">
                  Your name (optional)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full px-4 py-3 border border-[#E6F1EB] dark:border-gray-600 rounded-lg font-montserrat text-base text-[#538890] dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:border-[#538890] transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-montserrat font-semibold text-sm text-[#538890] dark:text-white/80">
                    Email
                  </label>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 border border-[#E6F1EB] dark:border-gray-600 rounded-lg font-montserrat text-base text-[#538890] dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:border-[#538890] transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-montserrat font-semibold text-sm text-[#538890] dark:text-white/80">
                Topic
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-3 border border-[#E6F1EB] dark:border-gray-600 rounded-lg font-montserrat text-base text-[#538890] dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:border-[#538890] transition-all duration-200"
              >
                <option>General</option>
                <option>Billing</option>
                <option>Access / Sign-in</option>
                <option>Bug report</option>
                <option>Feature request</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block font-montserrat font-semibold text-sm text-[#538890] dark:text-white/80">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help?"
                rows={5}
                required
                className="w-full px-4 py-3 border border-[#E6F1EB] dark:border-gray-600 rounded-lg font-montserrat text-base text-[#538890] dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:border-[#538890] transition-all duration-200"
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="font-montserrat text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            {sent && (
              <div className="bg-[#E6F1EB] dark:bg-gray-800/40 border border-[#CFE3DA] dark:border-gray-700 rounded-lg p-3">
                <p className="font-montserrat text-sm text-[#2F5C68] dark:text-white/80">
                  Thanks — your message has been sent
                  {ticketId ? ` (ref #${ticketId})` : ""}. We’ll reply to{" "}
                  {email}.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={sendMutation.isLoading}
              className="w-full bg-[#538890] hover:bg-[#538890]/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-montserrat font-semibold text-base px-8 py-3 rounded-full transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg"
            >
              {sendMutation.isLoading ? "Sending..." : "Send message"}
            </button>
            <p className="text-center font-montserrat text-xs text-[#538890]/60 dark:text-white/60">
              Prefer email? Write to {""}
              <a
                href="mailto:support@90secondsolutions.com"
                className="underline text-[#538890] dark:text-white"
              >
                support@90secondsolutions.com
              </a>
              .
            </p>
          </form>
        </div>

        {/* FAQ */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#E6F1EB] dark:border-gray-700 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="w-6 h-6 text-[#538890]" />
            <h2 className="font-roboto-serif font-bold text-2xl text-[#538890] dark:text-white/90">
              Quick answers
            </h2>
          </div>
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <LogIn className="w-4 h-4 text-[#538890]" />
                <h3 className="font-montserrat font-semibold text-base text-[#538890] dark:text-white/90">
                  Having trouble signing in?
                </h3>
              </div>
              <p className="font-montserrat text-sm text-[#538890]/80 dark:text-white/80">
                Try {""}
                <a className="underline" href="/account/signin">
                  signing in here
                </a>
                . If you forgot your password, use the link on the sign-in page.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CreditCard className="w-4 h-4 text-[#538890]" />
                <h3 className="font-montserrat font-semibold text-base text-[#538890] dark:text-white/90">
                  Billing or receipts
                </h3>
              </div>
              <p className="font-montserrat text-sm text-[#538890]/80 dark:text-white/80">
                Questions about billing? Send us a note above and we’ll help
                quickly.
              </p>
            </div>
            {/* added: Manage billing portal quick action */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CreditCard className="w-4 h-4 text-[#538890]" />
                <h3 className="font-montserrat font-semibold text-base text-[#538890] dark:text-white/90">
                  Manage billing
                </h3>
              </div>
              <p className="font-montserrat text-sm text-[#538890]/80 dark:text-white/80 mb-2">
                Update payment method, view invoices, or cancel anytime.
              </p>
              <button
                onClick={handleManageBilling}
                disabled={manageLoading}
                className="bg-white dark:bg-[#1E1E1E] border border-[#E6F1EB] dark:border-gray-700 hover:border-[#538890] dark:hover:border-[#538890] text-[#538890] dark:text-white font-montserrat font-semibold text-sm px-4 py-2 rounded-full transition-all duration-200"
              >
                {manageLoading ? "Opening…" : "Open billing portal"}
              </button>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-[#538890]" />
                <h3 className="font-montserrat font-semibold text-base text-[#538890] dark:text-white/90">
                  Free trial and resets
                </h3>
              </div>
              <p className="font-montserrat text-sm text-[#538890]/80 dark:text-white/80">
                New here? You can start a {""}
                <a className="underline" href="/reset">
                  90-second reset
                </a>{" "}
                anytime, then explore {""}
                <a className="underline" href="/lessons">
                  lessons
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        {/* Direct email option */}
        <div className="text-center mt-6">
          <p className="font-montserrat text-sm text-[#538890]/70 dark:text-white/70">
            Prefer to write your own email? Reach us at
            <a
              href="mailto:support@90secondsolutions.com"
              className="ml-1 text-[#538890] dark:text-white underline"
            >
              support@90secondsolutions.com
            </a>
            .
          </p>
        </div>
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Serif:wght@400;700;900&family=Montserrat:wght@400;600&display=swap');
        .font-roboto-serif { font-family: 'Roboto Serif', serif; }
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
      `}</style>
    </div>
  );
}
