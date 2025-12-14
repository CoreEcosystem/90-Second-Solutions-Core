import sql from "@/app/api/utils/sql";
import { getServerSession } from "@auth/create";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const rows = await sql`
      SELECT id, user_id, reflection_date, journaling_text, micro_action, feelings, energy, reset_emotion
      FROM daily_reflections
      WHERE user_id = ${userId}
      ORDER BY reflection_date DESC
      LIMIT 3
    `; // include reset_emotion for insights

    return Response.json({ reflections: rows || [] });
  } catch (err) {
    console.error("GET /api/reflection/recent error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
