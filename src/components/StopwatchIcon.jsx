export default function StopwatchIcon({
  className = "w-6 h-6",
  color = "#538890",
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stopwatch body */}
      <circle
        cx="50"
        cy="55"
        r="35"
        fill={color}
        stroke={color}
        strokeWidth="2"
      />

      {/* Crown/winding mechanism */}
      <rect x="47" y="15" width="6" height="8" rx="3" fill={color} />

      {/* Crown button */}
      <circle cx="50" cy="19" r="2.5" fill="#D3C970" />

      {/* Main dial background */}
      <circle cx="50" cy="55" r="30" fill="white" fillOpacity="0.9" />

      {/* 90 text */}
      <text
        x="50"
        y="48"
        textAnchor="middle"
        className="font-bold"
        fontSize="12"
        fill={color}
      >
        90
      </text>

      {/* SECONDS text */}
      <text
        x="50"
        y="62"
        textAnchor="middle"
        className="font-medium"
        fontSize="6"
        fill={color}
      >
        SECONDS
      </text>

      {/* Stopwatch hand pointing to 12 */}
      <line
        x1="50"
        y1="55"
        x2="50"
        y2="35"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Center dot */}
      <circle cx="50" cy="55" r="2" fill={color} />

      {/* Yellow accent dot at 12 o'clock position */}
      <circle cx="50" cy="30" r="2" fill="#D3C970" />
    </svg>
  );
}
