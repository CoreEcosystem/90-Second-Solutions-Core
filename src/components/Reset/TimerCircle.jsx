export function TimerCircle({ seconds, progress }) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative mx-auto w-48 h-48">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="#E5E7EB"
          strokeWidth="8"
          fill="none"
          className="dark:stroke-gray-600"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="#70A0B2"
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-roboto-serif font-bold text-4xl text-[#0B3A55] dark:text-white/90">
          {seconds}
        </span>
      </div>
    </div>
  );
}
