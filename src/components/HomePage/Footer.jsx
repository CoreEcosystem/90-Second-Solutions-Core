export function Footer() {
  return (
    <footer className="border-t border-gray-100 dark:border-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Layout: stack on mobile, split on larger screens */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4 text-center md:text-left">
          {/* Brand copy */}
          <div>
            <p className="font-montserrat text-sm text-[#538890]/70 dark:text-white/70">
              © 2025 90-Second Solutions
            </p>
            <p className="font-montserrat text-sm text-[#538890]/60 dark:text-white/60">
              A CORE Method™ for Emotional Regulation & Clarity
            </p>
          </div>

          {/* Footer links */}
          <nav className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
            <a
              href="/science"
              className="font-montserrat text-sm text-[#538890] dark:text-white hover:text-[#538890]/80 dark:hover:text-white/80 transition-colors"
            >
              About the Method
            </a>
            <a
              href="/privacy"
              className="font-montserrat text-sm text-[#538890] dark:text-white hover:text-[#538890]/80 dark:hover:text-white/80 transition-colors"
            >
              Privacy & Data Ethics
            </a>
            <a
              href="/contact"
              className="font-montserrat text-sm text-[#538890] dark:text-white hover:text-[#538890]/80 dark:hover:text-white/80 transition-colors"
            >
              Contact / Support
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
