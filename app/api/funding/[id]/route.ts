import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // disable ISR cache for true realtime updates

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const [startup, token] = await Promise.all([
    prisma.startup.findUnique({
      where: { id },
      select: { investments: { select: { amount: true } } },
    }),
    prisma.token.findUnique({
      where: { id },
      select: { fundingGoal: true, investments: { select: { amount: true } } },
    }),
  ]);
  const investments = startup?.investments ?? token?.investments ?? [];
  const amountRaised = investments.reduce((s, i) => s + Number(i.amount), 0);
  return NextResponse.json({ amountRaised });
}
