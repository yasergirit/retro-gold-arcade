import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getEffectiveTime } from "@/lib/timeUtils";

const schema = z.object({
  timezone: z.string().default("UTC"),
  simTime: z.string().optional(),
  demo: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { timezone, simTime, demo } = schema.parse(body);

    const isDemo = demo === "1";
    const { localDateStr, localHour, localMinute } = getEffectiveTime(timezone, isDemo ? simTime ?? null : null);

    // Check if it's past 12:00
    if (!(localHour > 12 || (localHour === 12 && localMinute >= 0))) {
      return NextResponse.json(
        { error: "Not yet time to claim. Wait until 12:00." },
        { status: 400 }
      );
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id },
    });

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.lastClaimDate === localDateStr) {
      return NextResponse.json(
        { error: "Already claimed today" },
        { status: 400 }
      );
    }

    const REWARD = 10;
    const [updatedWallet, transaction] = await prisma.$transaction([
      prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: { increment: REWARD },
          lastClaimDate: localDateStr,
          lastClaimAt: new Date(),
        },
      }),
      prisma.transaction.create({
        data: {
          walletId: wallet.id,
          amount: REWARD,
          type: "DAILY_CLAIM",
          description: "Daily gold reward",
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      amount: REWARD,
      balance: updatedWallet.balance,
      transaction: {
        id: transaction.id,
        amount: transaction.amount,
        type: transaction.type,
        description: transaction.description,
        createdAt: transaction.createdAt.toISOString(),
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
