import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/db";
import { users, payments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// Initialize Stripe (use test key for development)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");

const PRICES = {
  starter: {
    amount: 1900, // $19/month
    name: "Starter Plan",
    priceId: "price_starter_placeholder",
  },
  pro: {
    amount: 2900, // $29/month
    name: "Pro Plan",
    priceId: "price_pro_placeholder",
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan, userId, email } = body;

    if (!plan || !userId) {
      return NextResponse.json(
        { success: false, error: "Plan and user ID are required" },
        { status: 400 }
      );
    }

    const planDetails = PRICES[plan as keyof typeof PRICES];
    if (!planDetails) {
      return NextResponse.json(
        { success: false, error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    // Check if user exists
    const userList = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userList.length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const user = userList[0];

    // For demo/development, simulate successful payment
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === "sk_test_placeholder") {
      // Demo mode - create payment record and update subscription
      const paymentId = uuidv4();
      
      await db.insert(payments).values({
        id: paymentId,
        userId: user.id,
        amount: planDetails.amount,
        currency: "USD",
        status: "completed",
        plan: plan,
        createdAt: new Date(),
      });

      await db.update(users).set({
        subscriptionTier: plan,
        subscriptionStatus: "active",
        stripeSubscriptionId: `sub_demo_${paymentId}`,
      }).where(eq(users.id, user.id));

      return NextResponse.json({
        success: true,
        demo: true,
        data: {
          message: "Demo payment processed successfully",
          plan: plan,
          subscriptionId: `sub_demo_${paymentId}`,
        },
      });
    }

    // Production - Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: email || user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: planDetails.name,
              description: `Uganda Insights ${planDetails.name} - Monthly subscription`,
            },
            unit_amount: planDetails.amount,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
        plan: plan,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?payment=cancelled`,
    });

    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url,
      },
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

// Get subscription status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const userList = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userList.length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const user = userList[0];

    // Get payment history
    const userPayments = await db
      .select()
      .from(payments)
      .where(eq(payments.userId, userId))
      .orderBy(payments.createdAt)
      .limit(10);

    return NextResponse.json({
      success: true,
      data: {
        subscription: {
          tier: user.subscriptionTier,
          status: user.subscriptionStatus,
          customerId: user.stripeCustomerId,
          subscriptionId: user.stripeSubscriptionId,
        },
        payments: userPayments,
      },
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}
