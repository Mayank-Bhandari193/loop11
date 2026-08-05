import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    // 1. Ensure a Workspace exists in Database
    let workspace = await prisma.workspace.findFirst();
    if (!workspace) {
      workspace = await prisma.workspace.create({
        data: { name: "Default Workspace" },
      });
    }

    // 2. Ensure a User exists in Database
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "mayankbhandari267@gmail.com",
          name: "Mayank Bhandari",
          workspaceId: workspace.id,
          // passwordHash is required by the Prisma schema; using an empty string for seed
          passwordHash: "",
        },
      });
    }

    // 3. Ensure a FeatureAttraction exists
    let feature = await prisma.featureAttraction.findFirst();
    if (!feature) {
      feature = await prisma.featureAttraction.create({
        data: {
          title: "Dark Mode & Custom Tag Filters",
          description: "High contrast dark mode dashboard charts and custom tag filters in inbox.",
          totalVotes: 1,
        },
      });
    } else {
      // Increment vote count safely
      feature = await prisma.featureAttraction.update({
        where: { id: feature.id },
        data: { totalVotes: { increment: 1 } },
      });
    }

    // 4. Create the Feedback entry
    const feedback = await prisma.feedback.create({
      data: {
        content: body.content || `⚡ Simulated ticket injected at ${new Date().toLocaleTimeString()}`,
        sentiment: body.sentiment || "POSITIVE",
        workspaceId: workspace.id,
      },
    });

    // 5. Create the FeedbackAttraction relational row
    const feedbackAttraction = await prisma.feedbackAttraction.create({
      data: {
        featureAttractionId: feature.id,
        feedbackId: feedback.id,
        userId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Ticket seeded successfully!",
      data: {
        feedback,
        feedbackAttraction,
        feature,
      },
    });
  } catch (error: any) {
    console.error("Seed Attraction API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Simulation failed",
      },
      { status: 500 }
    );
  }
}