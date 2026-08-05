import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma"; // <--- Clean import

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, workspaceName } = body;

    // 1. Validation check
    if (!email || !password || !workspaceName) {
      return NextResponse.json(
        { error: "Email, password, and workspace name are required." },
        { status: 400 }
      );
    }

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email address." },
        { status: 400 }
      );
    }

    // 3. Password hashing with bcrypt
    const passwordHash = await bcrypt.hash(password, 10);

    // 4. Create Workspace
    const workspace = await prisma.workspace.create({
      data: {
        name: workspaceName,
      },
    });

    // 5. Create Primary User (ADMIN role)
    const user = await prisma.user.create({
      data: {
        name: name || "Mayank Bhandari",
        email,
        passwordHash,
        role: "ADMIN",
        workspaceId: workspace.id,
      },
    });

    // 6. Optional: Auto-onboard Team Member (S Manjunath Naidu) if needed for the workspace
    const teamMemberEmail = "manjunath@workspace.com";
    const existingTeamMember = await prisma.user.findUnique({
      where: { email: teamMemberEmail },
    });

    if (!existingTeamMember) {
      const teamPasswordHash = await bcrypt.hash("TeamPass123!", 10);
      await prisma.user.create({
        data: {
          name: "S Manjunath Naidu",
          email: teamMemberEmail,
          passwordHash: teamPasswordHash,
          role: "ADMIN",
          workspaceId: workspace.id,
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Account and workspace created successfully!",
        userId: user.id,
        workspaceId: workspace.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("SIGNUP_API_ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}