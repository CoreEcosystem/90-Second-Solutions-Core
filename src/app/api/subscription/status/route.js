import sql from "@/app/api/utils/sql";
import { getServerSession } from "@auth/create";
import Stripe from "stripe";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return Response.json(
        {
          status: "unauthenticated",
          subscription_tier: "free",
          subscription_status: "inactive",
        },
        { status: 401 },
      );
    }

    const userId = session.user.id;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Get user profile with subscription info
    const profileRows = await sql`
      SELECT 
        up.subscription_tier, up.subscription_status,
        up.stripe_customer_id, up.stripe_subscription_id,
        up.subscription_end_date
      FROM user_profiles up
      WHERE up.user_id = ${userId}
      LIMIT 1
    `;

    let profile = profileRows?.[0];

    // If no profile exists, create one
    if (!profile) {
      await sql`
        INSERT INTO user_profiles (user_id, subscription_tier, subscription_status)
        VALUES (${userId}, 'free', 'inactive')
      `;

      profile = {
        subscription_tier: "free",
        subscription_status: "inactive",
        stripe_customer_id: null,
        stripe_subscription_id: null,
        subscription_end_date: null,
      };
    }

    // If we have a Stripe subscription ID, check the current status with Stripe
    if (profile.stripe_subscription_id) {
      try {
        const subscription = await stripe.subscriptions.retrieve(
          profile.stripe_subscription_id,
        );

        // Update our database with the latest status from Stripe
        if (subscription.status !== profile.subscription_status) {
          await sql`
            UPDATE user_profiles 
            SET subscription_status = ${subscription.status},
                subscription_end_date = ${new Date(subscription.current_period_end * 1000).toISOString()},
                updated_at = NOW()
            WHERE user_id = ${userId}
          `;

          profile.subscription_status = subscription.status;
          profile.subscription_end_date = new Date(
            subscription.current_period_end * 1000,
          ).toISOString();
        }
      } catch (error) {
        console.error("Error fetching subscription from Stripe:", error);
        // If subscription doesn't exist in Stripe, mark as cancelled
        if (error.code === "resource_missing") {
          await sql`
            UPDATE user_profiles 
            SET subscription_status = 'cancelled',
                updated_at = NOW()
            WHERE user_id = ${userId}
          `;
          profile.subscription_status = "cancelled";
        }
      }
    }

    return Response.json({
      subscription_tier: profile.subscription_tier,
      subscription_status: profile.subscription_status,
      subscription_end_date: profile.subscription_end_date,
      is_premium:
        profile.subscription_tier === "premium" &&
        (profile.subscription_status === "active" ||
          profile.subscription_status === "trialing"),
    });
  } catch (err) {
    console.error("GET /api/subscription/status error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
