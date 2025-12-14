import sql from "@/app/api/utils/sql";
import { getServerSession } from "@auth/create";

function toYMD(date) {
  const d = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  return d.toISOString().split("T")[0];
}

function addDays(date, delta) {
  const d = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  d.setUTCDate(d.getUTCDate() + delta);
  return d;
}

function formatRangeLabel(start, end) {
  // Friendly label like "November 11–17, 2025" or cross-month "Oct 28 – Nov 3, 2025"
  const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
  const sameMonth = sameYear && start.getUTCMonth() === end.getUTCMonth();

  const fmtMonth = (d) =>
    d.toLocaleString("en-US", {
      month: sameMonth ? "long" : "short",
      timeZone: "UTC",
    });
  const startMonth = fmtMonth(start);
  const endMonth = end.toLocaleString("en-US", {
    month: "long",
    timeZone: "UTC",
  });

  const startDay = start.getUTCDate();
  const endDay = end.getUTCDate();
  const year = end.getUTCFullYear();

  if (sameMonth) {
    return `${endMonth} ${startDay}–${endDay}, ${year}`;
  }
  return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${year}`;
}

function ensureArrayMaybeJSON(value) {
  if (Array.isArray(value)) return value;
  if (value == null) return [];
  if (typeof value === "string") {
    try {
      const p = JSON.parse(value);
      return Array.isArray(p) ? p : [];
    } catch {
      return [];
    }
  }
  return [];
}

function classifyTrend(curr, prev) {
  if (prev === 0 && curr === 0) return "stable";
  if (prev === 0 && curr > 0) return "up";
  const change = (curr - prev) / (prev || 1);
  if (change > 0.1) return "up";
  if (change < -0.1) return "down";
  return "stable";
}

function buildActionCategories() {
  // Keyword buckets; simple heuristic to categorize text
  return [
    {
      label: "Connection-focused",
      keywords: [
        "connect",
        "call",
        "text",
        "message",
        "friend",
        "family",
        "reach",
        "relationship",
        "talk",
        "coffee",
        "meet",
        "share",
      ],
    },
    {
      label: "Learning-oriented",
      keywords: [
        "learn",
        "study",
        "read",
        "course",
        "class",
        "practice",
        "research",
        "tutorial",
        "lesson",
        "notes",
      ],
    },
    {
      label: "Health-conscious",
      keywords: [
        "exercise",
        "workout",
        "walk",
        "run",
        "gym",
        "yoga",
        "sleep",
        "diet",
        "meal",
        "water",
        "hydrate",
        "meditate",
        "breath",
        "breathing",
        "stretch",
      ],
    },
    {
      label: "Creative projects",
      keywords: [
        "create",
        "write",
        "writing",
        "paint",
        "draw",
        "art",
        "music",
        "song",
        "design",
        "sketch",
      ],
    },
    {
      label: "Productivity",
      keywords: [
        "plan",
        "task",
        "todo",
        "focus",
        "email",
        "inbox",
        "organize",
        "schedule",
        "prioritize",
        "deadline",
      ],
    },
  ];
}

function countActionFocus(rows) {
  const cats = buildActionCategories();
  const counts = new Map();
  for (const c of cats) counts.set(c.label, 0);

  for (const r of rows) {
    const text =
      `${r.micro_action || ""} ${r.journaling_text || ""}`.toLowerCase();
    if (!text.trim()) continue;
    for (const c of cats) {
      if (c.keywords.some((k) => text.includes(k))) {
        counts.set(c.label, (counts.get(c.label) || 0) + 1);
      }
    }
  }
  // Convert to array and sort by count desc
  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

function getStreakStats(rows, startDate, endDate) {
  const set = new Set(rows.map((r) => r.reflection_date));
  let longest = 0;
  let current = 0;
  let bestStart = null;
  let bestEnd = null;
  let tmpStart = null;

  for (
    let d = new Date(
      Date.UTC(
        startDate.getUTCFullYear(),
        startDate.getUTCMonth(),
        startDate.getUTCDate(),
      ),
    );
    d <= endDate;
    d = addDays(d, 1)
  ) {
    const key = toYMD(d);
    if (set.has(key)) {
      current += 1;
      if (current === 1) tmpStart = new Date(d);
      if (current > longest) {
        longest = current;
        bestStart = new Date(tmpStart);
        bestEnd = new Date(d);
      }
    } else {
      current = 0;
      tmpStart = null;
    }
  }
  return { longest, bestStart, bestEnd };
}

export async function GET(request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") === "month" ? "month" : "week";

    const today = new Date();
    const endCurr = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()),
    );
    const windowLen = period === "month" ? 30 : 7;
    const startCurr = addDays(endCurr, -(windowLen - 1));

    const endPrev = addDays(startCurr, -1);
    const startPrev = addDays(endPrev, -(windowLen - 1));

    const startCurrStr = toYMD(startCurr);
    const endCurrStr = toYMD(endCurr);
    const startPrevStr = toYMD(startPrev);
    const endPrevStr = toYMD(endPrev);

    const [currRows, prevRows] = await sql.transaction((txn) => [
      txn`SELECT reflection_date, selected_values, micro_action, journaling_text
           FROM daily_reflections
           WHERE user_id = ${userId}
             AND reflection_date BETWEEN ${startCurrStr} AND ${endCurrStr}
           ORDER BY reflection_date ASC`,
      txn`SELECT reflection_date, selected_values, micro_action, journaling_text
           FROM daily_reflections
           WHERE user_id = ${userId}
             AND reflection_date BETWEEN ${startPrevStr} AND ${endPrevStr}
           ORDER BY reflection_date ASC`,
    ]);

    // Values counting
    const valuesCount = new Map();
    const valuesDaysWithAny = new Set();
    for (const r of currRows) {
      const vals = ensureArrayMaybeJSON(r.selected_values);
      if (vals.length > 0) valuesDaysWithAny.add(r.reflection_date);
      for (const v of vals) {
        valuesCount.set(v, (valuesCount.get(v) || 0) + 1);
      }
    }
    const topValues = Array.from(valuesCount.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const prevValuesCount = new Map();
    for (const r of prevRows) {
      const vals = ensureArrayMaybeJSON(r.selected_values);
      for (const v of vals) {
        prevValuesCount.set(v, (prevValuesCount.get(v) || 0) + 1);
      }
    }

    const actionFocus = countActionFocus(currRows);
    const prevActionFocus = countActionFocus(prevRows);

    const totalValuesCurr = topValues.reduce((s, x) => s + x.count, 0);
    const totalValuesPrev = Array.from(prevValuesCount.values()).reduce(
      (s, x) => s + x,
      0,
    );
    const totalActionsCurr = actionFocus.reduce((s, x) => s + x.count, 0);
    const totalActionsPrev = prevActionFocus.reduce((s, x) => s + x.count, 0);

    const trends = {
      values: classifyTrend(totalValuesCurr, totalValuesPrev),
      reflections: classifyTrend(currRows.length, prevRows.length),
      actions: classifyTrend(totalActionsCurr, totalActionsPrev),
    };

    const streak = getStreakStats(currRows, startCurr, endCurr);

    const dateRangeLabel = formatRangeLabel(startCurr, endCurr);

    return Response.json({
      period,
      dateRangeLabel,
      windowLen,
      reflectionDays: currRows.length,
      topValues,
      actionFocus,
      trends,
      valuesDaysWithAny: valuesDaysWithAny.size,
    });
  } catch (err) {
    console.error("GET /api/insights/summary error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
