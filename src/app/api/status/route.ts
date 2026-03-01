import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getEffectiveTime, formatCountdown } from "@/lib/timeUtils";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const timezone = searchParams.get("timezone") || "UTC";
  const simTime = searchParams.get("simTime") || null;
  const demo = searchParams.get("demo") === "1";

  const { now, localDateStr, localHour, localMinute } = getEffectiveTime(timezone, demo ? simTime : null);

  const wallet = await prisma.wallet.findUnique({
    where: { userId: session.user.id },
  });

  const claimed = wallet?.lastClaimDate === localDateStr;
  const canClaim = !claimed && (localHour > 12 || (localHour === 12 && localMinute >= 0));

  let countdown: string | null = null;
  if (!claimed && !canClaim) {
    // calculate time until 12:00
    countdown = formatCountdown(now, timezone, demo ? simTime : null);
  }

  return NextResponse.json({
    canClaim,
    claimed,
    countdown,
    serverTime: now.toISOString(),
    localDate: localDateStr,
    localTime: `${String(localHour).padStart(2, "0")}:${String(localMinute).padStart(2, "0")}`,
  });
}
