import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

// Realistic simulated payloads mimicking external channel integrations
const SIMULATED_CHANNEL_SEEDS = [
  {
    channel: "Slack #user-feedback",
    content: "⚡ [Slack Integration] Users reporting that export button freezes when dataset exceeds 500 rows.",
    source: "IN_APP_PROMPT",
    rating: 2,
    ai: {
      sentiment: "NEGATIVE",
      sentimentScore: -0.75,
      summary: "Export button performance issue on large datasets.",
      intent: "Bug Report",
      urgencyLevel: "HIGH",
      tags: ["slack", "export", "performance"],
    },
  },
  {
    channel: "App Store Review",
    content: "⭐ [App Store] Absolutely love the new workspace switching functionality! Super smooth UI.",
    source: "MOBILE_APP",
    rating: 5,
    ai: {
      sentiment: "VERY_POSITIVE",
      sentimentScore: 0.95,
      summary: "User praised workspace switcher UI and performance.",
      intent: "Positive Feedback",
      urgencyLevel: "LOW",
      tags: ["app-store", "ui", "workspaces"],
    },
  },
  {
    channel: "Zendesk Support Ticket #4081",
    content: "📩 [Email Integration] Client invoice PDF generation was missed for Spectrum Workspace account.",
    source: "EMAIL",
    rating: 1,
    ai: {
      sentiment: "VERY_NEGATIVE",
      sentimentScore: -0.9,
      summary: "Missing billing invoice PDF generation.",
      intent: "Billing Issue",
      urgencyLevel: "CRITICAL",
      tags: ["zendesk", "billing", "invoice"],
    },
  },
  {
    channel: "Intercom In-App Widget",
    content: "💬 [Intercom Widget] Can we get dark mode toggle and custom tag filters in the inbox view?",
    source: "WEB",
    rating: 4,
    ai: {
      sentiment: "POSITIVE",
      sentimentScore: 0.6,
      summary: "Feature request for dark mode and tag filtering.",
      intent: "Feature Request",
      urgencyLevel: "MEDIUM",
      tags: ["intercom", "feature-request", "dark-mode"],
    },
  },
];

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;

    // Pick a random realistic channel seed
    const randomIndex = Math.floor(Math.random() * SIMULATED_CHANNEL_SEEDS.length);
    const sample = SIMULATED_CHANNEL_SEEDS[randomIndex];

    // Create Feedback + Linked AI Analysis in Neon PostgreSQL DB
    const feedback = await prisma.feedback.create({
      data: {
        userId: user.id,
        workspace: {
          connect: {
            id: user.workspaceId,
          },
        },
        content: sample.content,
        rating: sample.rating,
        source: sample.source as any,
        status: "PENDING",
        aiAnalysis: {
          create: {
            sentiment: sample.ai.sentiment as any,
            sentimentScore: sample.ai.sentimentScore,
            summary: sample.ai.summary,
            intent: sample.ai.intent,
            urgencyLevel: sample.ai.urgencyLevel as any,
            tags: sample.ai.tags,
          },
        },
      },
      include: {
        aiAnalysis: true,
      },
    });

    return NextResponse.json({
      success: true,
      channel: sample.channel,
      feedback,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Simulation failed", details: error.message },
      { status: 500 }
    );
  }
}