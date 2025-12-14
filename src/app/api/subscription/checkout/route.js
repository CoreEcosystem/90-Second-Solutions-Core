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
    const email = session.user.email;
    const body = await request.json();
    const { redirectURL } = body;

    if (!redirectURL) {
      return Response.json(
        { error: "Redirect URL is required" },
        { status: 400 },
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Get or create user profile
    let profileRows = await sql`
      SELECT stripe_customer_id FROM user_profiles 
      WHERE user_id = ${userId}
      LIMIT 1
    `;

    let stripeCustomerId = profileRows?.[0]?.stripe_customer_id;

    // If no profile exists or no stripe customer ID, create them
    if (!stripeCustomerId) {
      // Create new customer in Stripe
      const customer = await stripe.customers.create({
        email,
        metadata: {
          user_id: userId.toString(),
        },
      });
      stripeCustomerId = customer.id;

      // Create or update user profile with stripe customer ID
      await sql`
        INSERT INTO user_profiles (user_id, stripe_customer_id, subscription_tier, subscription_status)
        VALUES (${userId}, ${stripeCustomerId}, 'free', 'inactive')
        ON CONFLICT (user_id) 
        DO UPDATE SET stripe_customer_id = ${stripeCustomerId}
      `;
    }

    // Create checkout session for premium subscription with a 7-day free trial
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Premium Daily Mentor",
              description:
                "Unlock advanced insights, unlimited custom values, and enhanced reflection features",
            },
            recurring: { interval: "month" },
            unit_amount: 997, // $9.97/month
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${redirectURL}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: redirectURL,
      metadata: {
        user_id: userId.toString(),
      },
      subscription_data: {
        trial_period_days: 7, // 7-day free trial
        metadata: {
          user_id: userId.toString(),
        },
      },
      allow_promotion_codes: true,
    });

    return Response.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("POST /api/subscription/checkout error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
