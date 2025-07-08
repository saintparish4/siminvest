import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";
import { NextResponse } from "next/server";
import { PaymentStatus } from "@/generated/prisma";

type Body = {
    entityId: string; // 
    txHash: string; // fake test-net hash
    amount: number; // USD equivalent
}

export async function POST(req: Request) {
    const user = await getUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { entityId, txHash, amount } = await req.json() as Body;

    // GET (or create) a demo wallet row for this user
    const wallet = await prisma.wallet.upsert({
        where: { chain_address: { address: "0xDemoWallet", chain: "POLYGON" } },
        update: {},
        create: {
            userId: user.id,
            address: "0xDemoWallet",
            chain: "POLYGON",
        },
    });

    // Log the tx 
    await prisma.cryptoTx.create({
        data: {
            walletId: wallet.id,
            entityType: "TOKEN",
            entityId,
            txHash,
            amount,
            status: PaymentStatus.SUCCEEDED,
        },
    });

    // Investment Row
    const investment = await prisma.investment.create({
        data: {
            userId: user.id,
            tokenId: entityId,
            amount,
            ownership: 0, // Can compute % later or leave 0 for demo
        },
    });

    // Notification
    await prisma.notification.create({
        data: {
            userId: user.id,
            type: "TOKEN_PURCHASE_CONFIRMED",
            message: `Demo token purchase confirmed (hash ending ${txHash.slice(-6)}).`,
        },
    });

    return NextResponse.json({ investment });
}