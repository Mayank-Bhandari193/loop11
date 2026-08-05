import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

export async function POST() {
  try {
    // Find all feedbacks missing AI analysis
    const unclassified = await prisma.feedback.findMany({
      where: { aiAnalysis: null },
      take: 20,
    });

    let reclassifiedCount = 0;

    for (const item of unclassified) {
      const prompt = `Classify this user feedback into JSON format:
Content: "${item.content}"

Respond ONLY with valid JSON with keys:
"sentiment": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
"sentimentScore": float (-1 to 1),
"summary": "1 sentence summary",
"intent": "Bug Report" | "Feature Request" | "Billing Issue" | "General Feedback",
"urgencyLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"`;

      const response = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
      });

      const aiResult = JSON.parse(response.choices[0]?.message?.content || "{}");

      if (aiResult.sentiment) {
        await prisma.aiAnalysis.create({
          data: {
            feedbackId: item.id,
            sentiment: aiResult.sentiment,
            sentimentScore: aiResult.sentimentScore || 0,
            summary: aiResult.summary || "Summary unavailable",
            intent: aiResult.intent || "General Feedback",
            urgencyLevel: aiResult.urgencyLevel || "LOW",
          },
        });
        reclassifiedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully back-filled/classified ${reclassifiedCount} records.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}