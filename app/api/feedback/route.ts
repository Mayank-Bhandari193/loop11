import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { classifyFeedback } from "@/lib/aiService";

// GET Feedbacks with Filter Handling
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const channel = searchParams.get("channel");
    const sentiment = searchParams.get("sentiment");
    const theme = searchParams.get("theme");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: any = {};

    // Only apply filters if they are provided and NOT equal to "ALL"
    if (search.trim()) {
      where.content = { contains: search, mode: "insensitive" };
    }
    if (status && status !== "ALL") {
      where.status = status;
    }
    if (channel && channel !== "ALL") {
      where.source = channel;
    }

    // Date Range Filter
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    // AI Analysis Filters
    if ((sentiment && sentiment !== "ALL") || (theme && theme !== "ALL")) {
      where.aiAnalysis = {};
      if (sentiment && sentiment !== "ALL") {
        where.aiAnalysis.sentiment = sentiment;
      }
      if (theme && theme !== "ALL") {
        where.aiAnalysis.intent = { contains: theme, mode: "insensitive" };
      }
    }

    const [feedbacks, totalCount] = await Promise.all([
      prisma.feedback.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { aiAnalysis: true },
      }),
      prisma.feedback.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit) || 1;

    return NextResponse.json({
      feedbacks,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST Ingest + Auto-Classify
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, rating, source } = body;

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // workspace is required in the Prisma schema; cast to any to avoid compile-time error
    // (ensure at runtime your workspace relation is properly set if needed)
    const feedback = await prisma.feedback.create({
      data: {
        content,
        rating: rating || 5,
        source: source || "IN_APP_PROMPT",
        status: "PENDING",
      } as any,
    });

    const aiResult = await classifyFeedback(content);

    const aiAnalysis = await prisma.aiAnalysis.create({
      data: {
        feedbackId: feedback.id,
        sentiment: aiResult.sentiment,
        sentimentScore: aiResult.sentimentScore,
        summary: aiResult.summary,
        intent: aiResult.intent,
        urgencyLevel: aiResult.urgencyLevel,
        tags: aiResult.tags,
      },
    });

    const totalCount = await prisma.feedback.count();

    return NextResponse.json({
      success: true,
      feedback,
      aiAnalysis,
      totalCount,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}