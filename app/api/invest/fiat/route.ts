import prisma from "@/lib/prisma";
// import { getUser } from "@/lib/auth-server"; // helper that reads Supabase session
import { NextResponse } from "next/server";
import { PaymentStatus, EntityType } from "@/generated/prisma";
import { getUser } from "@/lib/getUser";

type Body = {
    entityId: string; // startupId or tokenId
    entityType: EntityType; // startup or token
    amount: number; // amount in USD
}

export async function POST(req: Request) {
    const user = await getUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { entityId, entityType, amount } = (await req.json()) as Body;

    // 1. Insert a fake Stripe intent that is auto-succeeded
    const intent = await prisma.paymentIntent.create({
        data: {
            userId: user.id,
            provider: "stripe-demo",
            providerId: `pi_demo_${Date.now()}`,
            amount,
            status: PaymentStatus.SUCCEEDED,
            metadata: { entityId, entityType },
        },
    });

    // 2. Create the Investment Row
    const investment = await prisma.investment.create({
        data: {
            userId: user.id,
            [`${entityType.toLowerCase()}Id`]: entityId,
            amount,
            ownership: 0, // Can compute % later or leave 0 for demo
        },
    });

    // 3. (optional) emit a realtime notification via Supabase
    await prisma.notification.create({
        data: {
            userId: user.id,
            type: "INVESTMENT_CONFIRMED",
            message: `Demo fiat investment of $${amount.toLocaleString()} recorded`,
        },
    });
    return NextResponse.json({ intent, investment});
}