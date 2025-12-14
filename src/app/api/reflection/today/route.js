import sql from "@/app/api/utils/sql";
import { getServerSession } from "@auth/create";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    const today = new Date().toISOString().split("T")[0];

    const rows = await sql`
      SELECT id, user_id, reflection_date, selected_values, micro_action, journaling_text, feelings, energy, reset_emotion, completed_at, created_at
      FROM daily_reflections
      WHERE user_id = ${userId} AND reflection_date = ${today}
      LIMIT 1
    `; // include reset_emotion in selection

    const reflection = rows?.[0] || null;

    return Response.json({ reflection });
  } catch (err) {
    console.error("GET /api/reflection/today error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
