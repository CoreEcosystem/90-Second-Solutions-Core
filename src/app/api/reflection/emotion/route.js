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
    const resetEmotionRaw =
      typeof body?.resetEmotion === "string" ? body.resetEmotion.trim() : "";
    const resetEmotion = resetEmotionRaw || null; // store null if empty

    const today = new Date().toISOString().split("T")[0];

    await sql`
      INSERT INTO daily_reflections (user_id, reflection_date, selected_values, micro_action, journaling_text, feelings, energy, reset_emotion)
      VALUES (${userId}, ${today}, ${JSON.stringify([])}, ${null}, ${null}, ${null}, ${null}, ${resetEmotion})
      ON CONFLICT (user_id, reflection_date)
      DO UPDATE SET
        reset_emotion = ${resetEmotion},
        completed_at = NOW()
    `;

    return Response.json({ success: true, resetEmotion });
  } catch (err) {
    console.error("POST /api/reflection/emotion error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
