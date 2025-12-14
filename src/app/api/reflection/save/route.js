import sql from "@/app/api/utils/sql";
import { getServerSession } from "@auth/create";

export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();

    // Optional values selection (can be empty array)
    const selectedValuesRaw = body?.selectedValues;
    const selectedValues = Array.isArray(selectedValuesRaw)
      ? selectedValuesRaw
      : [];

    // New journaling fields
    const journalingTextRaw =
      typeof body?.journalingText === "string" ? body.journalingText : "";
    const journalingText = journalingTextRaw.trim();
    const microActionRaw =
      typeof body?.microAction === "string" ? body.microAction : "";
    const microAction = microActionRaw.trim();

    const feelingsRaw = Array.isArray(body?.feelings) ? body.feelings : null; // e.g., ["Calm", "Focused"]
    const energyRaw = typeof body?.energy === "number" ? body.energy : null; // 1..5

    // Validation: allow save if at least journaling text OR micro action is provided
    if (!journalingText && !microAction) {
      return Response.json(
        { error: "Please add some journal text or a micro-action" },
        { status: 400 },
      );
    }

    // Normalize payload going into SQL
    const feelingsJson =
      feelingsRaw && feelingsRaw.length > 0
        ? JSON.stringify(feelingsRaw)
        : null;
    const safeEnergy =
      energyRaw != null
        ? Math.max(1, Math.min(5, Math.round(energyRaw)))
        : null;

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    // Upsert today's reflection with new columns (journaling_text, feelings, energy). micro_action is now optional (nullable) after migration
    await sql`
      INSERT INTO daily_reflections (user_id, reflection_date, selected_values, micro_action, journaling_text, feelings, energy)
      VALUES (${userId}, ${today}, ${JSON.stringify(selectedValues)}, ${microAction || null}, ${journalingText || null}, ${feelingsJson}, ${safeEnergy})
      ON CONFLICT (user_id, reflection_date)
      DO UPDATE SET 
        selected_values = ${JSON.stringify(selectedValues)},
        micro_action = ${microAction || null},
        journaling_text = ${journalingText || null},
        feelings = ${feelingsJson},
        energy = ${safeEnergy},
        completed_at = NOW()
    `;

    // Save any custom values to the custom_values table (unchanged behavior)
    for (const value of selectedValues) {
      const coreValues = [
        "Family",
        "Creativity",
        "Growth",
        "Health",
        "Adventure",
        "Peace",
        "Connection",
        "Learning",
        "Courage",
        "Gratitude",
        "Freedom",
        "Purpose",
        "Joy",
        "Balance",
        "Integrity",
      ];

      if (!coreValues.includes(value)) {
        await sql`
          INSERT INTO custom_values (user_id, value_name)
          VALUES (${userId}, ${value})
          ON CONFLICT (user_id, value_name) DO NOTHING
        `;
      }
    }

    return Response.json({
      success: true,
      reflection_date: today,
    });
  } catch (err) {
    console.error("POST /api/reflection/save error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
