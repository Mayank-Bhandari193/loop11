import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const allFeedbacks = await prisma.feedback.findMany({
      include: { aiAnalysis: true },
      orderBy: { createdAt: "desc" },
    });

    const total = allFeedbacks.length;
    let positive = 0;
    let resolved = 0;

    const sentimentCounts = {
      VERY_POSITIVE: 0,
      POSITIVE: 0,
      NEUTRAL: 0,
      NEGATIVE: 0,
      VERY_NEGATIVE: 0,
    };

    const themeMap: Record<string, number> = {};

    allFeedbacks.forEach((item) => {
      // Status Count
      if (item.status === "RESOLVED") resolved++;

      // AI Analysis stats
      if (item.aiAnalysis) {
        const sent = item.aiAnalysis.sentiment;
        if (sent in sentimentCounts) {
          sentimentCounts[sent as keyof typeof sentimentCounts]++;
        }
        if (sent === "POSITIVE" || sent === "VERY_POSITIVE") {
          positive++;
        }

        const intent = item.aiAnalysis.intent || "General";
        themeMap[intent] = (themeMap[intent] || 0) + 1;
      }
    });

    const positiveRate = total > 0 ? Math.round((positive / total) * 100) : 0;
    const responseRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    // Format Sentiment Data for Recharts Donut
    const sentimentChartData = [
      { name: "Positive", value: sentimentCounts.VERY_POSITIVE + sentimentCounts.POSITIVE, color: "#10b981" },
      { name: "Neutral", value: sentimentCounts.NEUTRAL, color: "#f59e0b" },
      { name: "Negative", value: sentimentCounts.VERY_NEGATIVE + sentimentCounts.NEGATIVE, color: "#f43f5e" },
    ];

    // Format Top Themes Bar Chart
    const themeChartData = Object.entries(themeMap)
      .map(([theme, count]) => ({ theme, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    return NextResponse.json({
      totalFeedback: total,
      positiveRate: `${positiveRate}%`,
      topCategory: themeChartData[0]?.theme || "N/A",
      responseRate: `${responseRate}%`,
      sentimentChartData,
      themeChartData,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}