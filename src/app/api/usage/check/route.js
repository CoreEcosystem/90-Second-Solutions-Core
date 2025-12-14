import { getServerSession } from "@auth/create";
import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
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

    // 100% paywall: non-premium has no free quota
    const usageData = {
      is_premium: isPremium,
      lessons_completed: currentProfile.lessons_completed || 0,
      resets_completed: currentProfile.resets_completed || 0,
      lessons_remaining: isPremium ? "unlimited" : 0,
      resets_remaining: isPremium ? "unlimited" : 0,
      lessons_limit_reached: !isPremium, // always true when not premium
      resets_limit_reached: !isPremium, // always true when not premium
      paywalled: !isPremium,
    };

    return Response.json(usageData);
  } catch (error) {
    console.error("Usage check error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
