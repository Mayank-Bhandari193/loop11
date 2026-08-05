import Groq from "groq-sdk";
import { z } from "zod";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

export const ClassificationSchema = z.object({
  sentiment: z.enum(["VERY_POSITIVE", "POSITIVE", "NEUTRAL", "NEGATIVE", "VERY_NEGATIVE"]),
  sentimentScore: z.number().min(-1).max(1),
  summary: z.string(),
  intent: z.string(),
  urgencyLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  tags: z.array(z.string()),
});

export async function classifyFeedback(content: string) {
  // $0 Fallback Mock if GROQ_API_KEY is not set
  if (!process.env.GROQ_API_KEY) {
    return {
      sentiment: "NEGATIVE" as const,
      sentimentScore: -0.75,
      summary: "User reported technical friction or feature enhancement request.",
      intent: "Software Bug",
      urgencyLevel: "HIGH" as const,
      tags: ["user-report", "auto-classified"],
    };
  }

  const prompt = `Analyze this feedback and return ONLY a valid JSON object matching this schema:
  {
    "sentiment": "VERY_POSITIVE" | "POSITIVE" | "NEUTRAL" | "NEGATIVE" | "VERY_NEGATIVE",
    "sentimentScore": number between -1 and 1,
    "summary": "one sentence summary",
    "intent": "e.g. Bug Report, Feature Request, Billing Issue",
    "urgencyLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
    "tags": ["tag1", "tag2"]
  }

  Content: "${content}"`;

  const response = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
  });

  const rawText = response.choices[0]?.message?.content || "{}";
  return ClassificationSchema.parse(JSON.parse(rawText));
}