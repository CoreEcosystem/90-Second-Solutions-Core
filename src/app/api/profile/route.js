import sql from "@/app/api/utils/sql";
import { getServerSession } from "@auth/create";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user profile with subscription info
    const profileRows = await sql`
      SELECT 
        au.id, au.name, au.email, au.image,
        up.subscription_tier, up.subscription_status,
        up.subscription_start_date, up.subscription_end_date,
        up.stripe_customer_id
      FROM auth_users au
      LEFT JOIN user_profiles up ON au.id = up.user_id
      WHERE au.id = ${userId}
      LIMIT 1
    `;

    const user = profileRows?.[0] || null;

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // If no profile exists yet, create one with default values
    if (!user.subscription_tier) {
      await sql`
        INSERT INTO user_profiles (user_id, subscription_tier, subscription_status)
        VALUES (${userId}, 'free', 'inactive')
        ON CONFLICT (user_id) DO NOTHING
      `;

      user.subscription_tier = "free";
      user.subscription_status = "inactive";
    }

    return Response.json({ user });
  } catch (err) {
    console.error("GET /api/profile error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { name, image } = body || {};

    const setClauses = [];
    const values = [];

    if (typeof name === "string" && name.trim().length > 0) {
      setClauses.push(`name = $${values.length + 1}`);
      values.push(name.trim());
    }

    if (typeof image === "string") {
      setClauses.push(`image = $${values.length + 1}`);
      values.push(image);
    }

    if (setClauses.length === 0) {
      return Response.json(
        { error: "No valid fields to update" },
        { status: 400 },
      );
    }

    const finalQuery = `UPDATE auth_users SET ${setClauses.join(", ")} WHERE id = $${values.length + 1} RETURNING id, name, email, image`;

    const result = await sql(finalQuery, [...values, userId]);
    const updated = result?.[0] || null;

    return Response.json({ user: updated });
  } catch (err) {
    console.error("PUT /api/profile error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
