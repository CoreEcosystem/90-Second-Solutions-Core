import sql from "@/app/api/utils/sql";
import { getServerSession } from "@auth/create";
import Stripe from "stripe";

export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { session_id } = body;

    if (!session_id) {
      return Response.json(
        { error: "Session ID is required" },
        { status: 400 },
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Retrieve the checkout session from Stripe
    const checkoutSession = await stripe.checkout.sessions.retrieve(
      session_id,
      {
        expand: ["subscription"],
      },
    );

    // On success, a subscription will be present. It may be trialing or active.
    if (checkoutSession.subscription) {
      const subscription = checkoutSession.subscription;

      await sql`
        UPDATE user_profiles 
        SET 
          subscription_tier = 'premium',
          subscription_status = ${subscription.status},
          stripe_subscription_id = ${subscription.id},
          subscription_start_date = ${new Date(subscription.current_period_start * 1000).toISOString()},
          subscription_end_date = ${new Date(subscription.current_period_end * 1000).toISOString()},
          updated_at = NOW()
        WHERE user_id = ${userId}
      `;

      return Response.json({
        success: true,
        subscription_tier: "premium",
        subscription_status: subscription.status,
      });
    } else {
      return Response.json(
        {
          error: "No subscription found on checkout session",
        },
        { status: 400 },
      );
    }
  } catch (err) {
    console.error("POST /api/subscription/success error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
