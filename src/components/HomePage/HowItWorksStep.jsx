export function HowItWorksStep({
  number,
  title,
  description,
  bgColor,
  isLink,
  href,
}) {
  const content = (
    <div className="relative bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#E6F1EB] dark:border-gray-700 p-6 sm:p-8 hover:border-[#538890] dark:hover:border-[#538890] transition-all duration-300 card-hover">
      {/* mobile dot on the line for this step (soft pulse) */}
      <div
        className="sm:hidden absolute left-[12px] top-[26px] w-[6px] h-[6px] rounded-full bg-[#D3C970] soft-pulse"
        aria-hidden="true"
      />

      <div className="relative flex items-center gap-4 mb-3 pl-12 sm:pl-0">
        <div
          className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center font-montserrat font-bold ${number === 2 ? "text-[#8B7A3F]" : "text-[#538890]"} absolute left-[-8px] top-6 sm:static`}
        >
          {number}
        </div>
        <h3 className="font-roboto-serif font-extrabold text-xl text-[#538890] dark:text-white/90">
          {title}
        </h3>
      </div>
      <p className="font-montserrat text-sm sm:text-base text-[#538890]/75 dark:text-white/75 leading-relaxed">
        {description}
      </p>
    </div>
  );

  if (isLink) {
    return (
      <a href={href} className="group block" aria-label={`Go to ${title}`}>
        {content}
      </a>
    );
  }

  return content;
}
