import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query || query.trim() === "") {
      return NextResponse.json({ error: "Please enter a query to search." }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || !apiKey.startsWith("gsk_")) {
      return NextResponse.json(
        { error: "Invalid API Key. Please update GROQ_API_KEY in .env file and restart server." },
        { status: 401 }
      );
    }

    const groq = new Groq({ apiKey });

    // Situation 1: Search Database for relevant queries using insensitive mode
    const matchingFeedbacks = await prisma.feedback.findMany({
      where: {
        OR: [
          { content: { contains: query, mode: "insensitive" } },
          {
            aiAnalysis: {
              OR: [
                { intent: { contains: query, mode: "insensitive" } },
                { summary: { contains: query, mode: "insensitive" } },
              ],
            },
          },
        ],
      },
      include: { aiAnalysis: true },
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    // Situation 2: If no matches found for the specific situation/topic
    if (matchingFeedbacks.length === 0) {
      return NextResponse.json({
        answer: `No specific user feedback or reports found regarding "${query}". Try searching for other terms like 'login', 'bug', or 'ui'.`,
      });
    }

    // Build context with specific items found for this situation
    const context = matchingFeedbacks
      .map(
        (f, i) =>
          `[Source ${i + 1}]: Content: "${f.content}" | Intent: ${f.aiAnalysis?.intent || "General"} | Sentiment: ${f.aiAnalysis?.sentiment || "NEUTRAL"}`
      )
      .join("\n");

    const systemPrompt = `You are the AI analyst for Loop11. Analyze ONLY the provided context to answer the user's situation. 
Rules:
1. Provide a direct, unique answer strictly based on the matched records.
2. ALWAYS cite the exact references using [Source 1], [Source 2], etc.
3. Keep the response factual and concise.`;

    const userPrompt = `Situation Query: "${query}"\n\nMatched Context Records:\n${context}`;

    const response = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1, // Low temperature for factual precision
    });

    const answer = response.choices[0]?.message?.content || "No detailed insights could be extracted.";

    return NextResponse.json({ answer });
  } catch (err: any) {
    console.error("Ask API Error:", err);
    return NextResponse.json({ error: err.message || "Error processing request." }, { status: 500 });
  }
}