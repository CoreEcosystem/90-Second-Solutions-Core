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
    const { redirectURL } = body || {};

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Fetch the Stripe customer ID from our DB
    const rows = await sql`
      SELECT stripe_customer_id FROM user_profiles WHERE user_id = ${userId} LIMIT 1
    `;

    const stripeCustomerId = rows?.[0]?.stripe_customer_id;

    if (!stripeCustomerId) {
      return Response.json(
        { error: "No Stripe customer found for this user" },
        { status: 400 },
      );
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: redirectURL || process.env.APP_URL || "https://example.com",
    });

    return Response.json({ url: portalSession.url });
  } catch (err) {
    console.error("POST /api/subscription/portal error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
