import { getServerSession } from "@auth/create";
import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type } = await request.json();
    if (!type || !["lesson", "reset"].includes(type)) {
      return Response.json({ error: "Invalid type" }, { status: 400 });
    }

    const userId = session.user.id;

    // Get current profile or create if not exists
    let profile = await sql`
      SELECT * FROM user_profiles WHERE user_id = ${userId}
    `;

    if (profile.length === 0) {
      await sql`
        INSERT INTO user_profiles (user_id, lessons_completed, resets_completed)
        VALUES (${userId}, 0, 0)
      `;
      profile = await sql`
        SELECT * FROM user_profiles WHERE user_id = ${userId}
      `;
    }

    const currentProfile = profile[0];

    // Check if premium user (active OR trialing)
    const isPremium =
      currentProfile.subscription_tier === "premium" &&
      (currentProfile.subscription_status === "active" ||
        currentProfile.subscription_status === "trialing");

    // 100% paywall: block non-premium outright
    if (!isPremium) {
      return Response.json(
        {
          error: "Premium required",
          paywalled: true,
          type,
        },
        { status: 403 },
      );
    }

    // Increment the appropriate counter (still track premium usage)
    if (type === "lesson") {
      await sql`
        UPDATE user_profiles 
        SET lessons_completed = lessons_completed + 1
        WHERE user_id = ${userId}
      `;
    } else {
      await sql`
        UPDATE user_profiles 
        SET resets_completed = resets_completed + 1
        WHERE user_id = ${userId}
      `;
    }

    // Get updated profile
    const updatedProfile = await sql`
      SELECT * FROM user_profiles WHERE user_id = ${userId}
    `;

    return Response.json({
      success: true,
      profile: updatedProfile[0],
    });
  } catch (error) {
    console.error("Usage tracking error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
