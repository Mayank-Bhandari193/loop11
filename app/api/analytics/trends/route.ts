import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Current 7 Days Period
    const currentPeriod = await prisma.aiAnalysis.findMany({
      where: {
        feedback: {
          createdAt: { gte: sevenDaysAgo },
        },
      },
    });

    // Previous 7 Days Period (Fixed createdAt nesting here)
    const previousPeriod = await prisma.aiAnalysis.findMany({
      where: {
        feedback: {
          createdAt: {
            gte: fourteenDaysAgo,
            lt: sevenDaysAgo,
          },
        },
      },
    });

    const currentCounts: Record<string, number> = {};
    const previousCounts: Record<string, number> = {};

    currentPeriod.forEach((a) => {
      const intent = a.intent || "General";
      currentCounts[intent] = (currentCounts[intent] || 0) + 1;
    });

    previousPeriod.forEach((a) => {
      const intent = a.intent || "General";
      previousCounts[intent] = (previousCounts[intent] || 0) + 1;
    });

    const trends = Object.keys(currentCounts).map((theme) => {
      const curr = currentCounts[theme] || 0;
      const prev = previousCounts[theme] || 0;
      const percentChange =
        prev === 0 ? (curr > 0 ? 100 : 0) : ((curr - prev) / prev) * 100;

      return {
        theme,
        currentVolume: curr,
        previousVolume: prev,
        percentChange: Math.round(percentChange),
        isSpike: percentChange >= 50,
      };
    });

    return NextResponse.json({ trends });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
