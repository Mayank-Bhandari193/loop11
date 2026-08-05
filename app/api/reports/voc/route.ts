import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import Groq from "groq-sdk";

export async function POST() {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || !apiKey.startsWith("gsk_")) {
      return NextResponse.json(
        { error: "Invalid API Key in .env file. Please check GROQ_API_KEY." },
        { status: 401 }
      );
    }

    const groq = new Groq({ apiKey });

    // 1. Pre-compute Statistics
    const allFeedbacks = await prisma.feedback.findMany({
      include: { aiAnalysis: true },
    });

    const totalCount = allFeedbacks.length;
    if (totalCount === 0) {
      return NextResponse.json(
        { error: "No feedbacks available to generate report." },
        { status: 400 }
      );
    }

    let positiveCount = 0;
    const intentCounts: Record<string, number> = {};

    allFeedbacks.forEach((f) => {
      const sentiment = f.aiAnalysis?.sentiment;
      if (sentiment === "POSITIVE" || sentiment === "VERY_POSITIVE") {
        positiveCount++;
      }
      const intent = f.aiAnalysis?.intent || "General Feedback";
      intentCounts[intent] = (intentCounts[intent] || 0) + 1;
    });

    const positiveRatio = Math.round((positiveCount / totalCount) * 100);

    let topCategory = "General Feedback";
    let maxCount = 0;
    Object.entries(intentCounts).forEach(([cat, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topCategory = cat;
      }
    });

    // 2. Context for Groq Llama 3 Narrative
    const sampleSummaries = allFeedbacks
      .slice(0, 10)
      .map((f, i) => `${i + 1}. ${f.aiAnalysis?.summary || f.content}`)
      .join("\n");

    const prompt = `You are a Chief Product Officer writing an executive Voice-of-Customer (VoC) report.
Based on the following stats:
- Total Feedbacks Analyzed: ${totalCount}
- Positive Sentiment Ratio: ${positiveRatio}%
- Top Category/Issue: ${topCategory}
- Sample Feedback Insights:
${sampleSummaries}

Generate a structured JSON response with exactly these keys:
{
  "title": "Voice of Customer Executive Report - ${new Date().toLocaleDateString()}",
  "executiveSummary": "2-3 sentences high level summary of user sentiment and key trends.",
  "keyInsights": ["Insight 1", "Insight 2", "Insight 3"],
  "recommendations": ["Actionable Recommendation 1", "Actionable Recommendation 2"]
}`;

    const aiResponse = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You output only valid raw JSON." },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const rawJson = JSON.parse(aiResponse.choices[0]?.message?.content || "{}");

    // 3. Exact camelCase Prisma Client delegate: prisma.vocReport
    const report = await prisma.vocReport.create({
      data: {
        title: rawJson.title || `VoC Report - ${new Date().toLocaleDateString()}`,
        executiveSummary: rawJson.executiveSummary || "Summary generated successfully.",
        keyInsights: rawJson.keyInsights || ["Primary product stability holds firm."],
        recommendations: rawJson.recommendations || ["Continue tracking user feedback."],
        totalAnalyzed: totalCount,
        positiveRatio: positiveRatio,
        topCategory: topCategory,
      },
    });

    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    console.error("VoC Report API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Exact camelCase Prisma Client delegate: prisma.vocReport
    const latestReport = await prisma.vocReport.findFirst({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ report: latestReport });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}