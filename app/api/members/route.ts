import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // 1. Authentication Check
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;

    // 2. RBAC Check (Only ADMIN allowed)
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    // 3. Query Scoped by workspaceId
    const members = await prisma.user.findMany({
      where: {
        workspaceId: user.workspaceId, // Scoped to active workspace
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ members }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch members", details: error.message },
      { status: 500 }
    );
  }
}