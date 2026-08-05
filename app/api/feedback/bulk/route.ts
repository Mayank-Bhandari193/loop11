import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    // 1. Session check
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    const body = await req.json();
    const { items } = body; // CSV parsed rows

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "No valid items provided in CSV" },
        { status: 400 }
      );
    }

    let successCount = 0;
    let failureCount = 0;
    const errors: string[] = [];

    // 2. Validate & Insert loop
    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      const content = item.content?.trim();
      const rating = item.rating ? parseInt(item.rating) : null;
      const source = item.source?.trim() || "WEB";

      if (!content) {
        failureCount++;
        errors.push(`Row ${index + 1}: Content field is missing.`);
        continue;
      }

      try {
        await prisma.feedback.create({
          data: {
            userId: user.id,
            workspaceId: user.workspaceId,
            content,
            rating: rating && rating >= 1 && rating <= 5 ? rating : null,
            source: ["WEB", "MOBILE_APP", "EMAIL", "IN_APP_PROMPT"].includes(source)
              ? (source as any)
              : "WEB",
            status: "PENDING",
          },
        });
        successCount++;
      } catch (err: any) {
        failureCount++;
        errors.push(`Row ${index + 1}: ${err.message}`);
      }
    }

    // 3. Return summary object
    return NextResponse.json({
      success: true,
      summary: {
        total: items.length,
        inserted: successCount,
        failed: failureCount,
        errors,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Bulk import process failed", details: error.message },
      { status: 500 }
    );
  }
}