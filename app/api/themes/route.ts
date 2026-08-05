import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const analyses = await prisma.aiAnalysis.findMany({
      include: {
        feedback: true,
      },
    });

    // Grouping by Intent / Theme
    const themeMap: Record<string, { count: number; items: any[] }> = {};

    analyses.forEach((item) => {
      const theme = item.intent || "Uncategorized";
      if (!themeMap[theme]) {
        themeMap[theme] = { count: 0, items: [] };
      }
      themeMap[theme].count += 1;
      themeMap[theme].items.push({
        id: item.feedbackId,
        content: item.feedback.content,
        sentiment: item.sentiment,
        createdAt: item.feedback.createdAt,
      });
    });

    const themes = Object.entries(themeMap).map(([theme, data]) => ({
      theme,
      count: data.count,
      feedbacks: data.items,
    }));

    return NextResponse.json({ themes });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}