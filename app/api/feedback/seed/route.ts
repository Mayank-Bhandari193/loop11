import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    // Database me existing feedback count nikalein
    const currentCount = await prisma.feedback.count();
    const nextSequenceNumber = currentCount + 1;

    // Database me naya seeded ticket save karein (with type casting as any to avoid Enum mismatch)
    const newFeedback = await prisma.feedback.create({
      data: {
        title: `[Webhook Ticket #${nextSequenceNumber}] Simulated telemetry alert injected at ${new Date().toLocaleTimeString()}`,
        source: "WEBHOOK" as any,
        rating: Math.floor(Math.random() * 5) + 1,
        sentiment: (Math.random() > 0.5 ? "POSITIVE" : "NEGATIVE") as any,
        intent: "Simulated Test",
        status: "NEW" as any,
        channel: "Webhook",
      } as any,
    });

    return NextResponse.json({
      success: true,
      data: newFeedback,
      totalCount: nextSequenceNumber,
    });
  } catch (error) {
    console.error("Seed API Error:", error);
    return NextResponse.json(
      { success: false, error: "Database Sync Failed" },
      { status: 500 }
    );
  }
}