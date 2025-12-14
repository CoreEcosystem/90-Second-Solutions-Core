import { Play, ChevronRight } from "lucide-react";

export function PillarCard({
  href,
  icon: Icon,
  iconBgColor,
  title,
  subtitle,
  description,
  features,
  ctaText,
  ctaColor,
  borderHoverColor,
}) {
  return (
    <a href={href} className="group">
      <div
        className={`bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#E6F1EB] dark:border-gray-700 p-8 sm:p-10 space-y-6 hover:border-${borderHoverColor} dark:hover:border-${borderHoverColor} transition-all duration-300 ease-out card-hover`}
      >
        <div className="flex items-center gap-4">
          <div className={`${iconBgColor} p-3 rounded-full breathing-ring`}>
            <Icon className="w-6 h-6 text-[#538890] dark:text-[#A4C3D2]" />
          </div>
          <div>
            <h2 className="font-roboto-serif font-bold text-2xl sm:text-3xl text-[#538890] dark:text-white/90">
              {title}
            </h2>
            <p className="font-montserrat font-semibold text-sm text-[#538890]/70 dark:text-white/70 mt-1">
              {subtitle}
            </p>
          </div>
        </div>

        <p className="font-montserrat text-base text-[#538890]/70 dark:text-white/70 leading-relaxed">
          {description}
        </p>

        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li
              key={index}
              className="font-montserrat text-sm text-[#538890]/70 dark:text-white/70 flex items-start gap-2"
            >
              <span className="text-[#538890] dark:text-[#538890] mt-0.5">
                •
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <div className="relative flex items-center gap-3">
            <div className="pulsing-dot"></div>
            <Play
              className={`w-5 h-5 text-${ctaColor} dark:text-${ctaColor}`}
            />
          </div>
          <span
            className={`font-montserrat font-semibold text-sm text-${ctaColor} dark:text-${ctaColor} group-hover:underline`}
          >
            {ctaText}
          </span>
          <ChevronRight
            className={`w-4 h-4 text-${ctaColor} dark:text-${ctaColor} group-hover:translate-x-1 transition-transform duration-200`}
          />
        </div>
      </div>
    </a>
  );
}
