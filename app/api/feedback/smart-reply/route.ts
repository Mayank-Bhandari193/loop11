import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const { feedbackText, sentiment, channel } = await req.json();

    if (!feedbackText) {
      return NextResponse.json(
        { success: false, error: "Feedback content is required." },
        { status: 400 }
      );
    }

    // Clean API Key
    const rawApiKey = process.env.GROQ_API_KEY || "";
    const cleanApiKey = rawApiKey.replace(/["'\s]/g, "");

    const groq = new Groq({ apiKey: cleanApiKey });

    const systemPrompt = `
You are an expert Executive Product Ops & Customer Success AI.
Analyze the given customer feedback and return a STRICT JSON response only.

Schema:
{
  "churnRisk": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
  "urgencyScore": number (1 to 10),
  "rootCause": "Short explanation of the actual issue",
  "suggestedReply": "A empathetic, professional, and actionable email/chat response draft addressing the customer directly",
  "suggestedActionItem": "Actionable task for engineering/product team"
}
`;

    const userPrompt = `
Customer Feedback: "${feedbackText}"
Channel: ${channel || "WEB"}
Reported Sentiment: ${sentiment || "NEUTRAL"}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const aiOutput = JSON.parse(completion.choices[0]?.message?.content || "{}");

    return NextResponse.json({
      success: true,
      analysis: aiOutput,
    });
  } catch (error: any) {
    console.error("Smart Reply API Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to generate response." },
      { status: 500 }
    );
  }
}