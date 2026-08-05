import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const targetEmail = credentials?.email || "mayankbhandari267@gmail.com";

        let user = await prisma.user.findFirst({
          where: { email: targetEmail },
        });

        if (!user) {
          let workspace = await prisma.workspace.findFirst();
          if (!workspace) {
            workspace = await prisma.workspace.create({
              data: { name: "Default Workspace" },
            });
          }

          user = await prisma.user.create({
            data: {
              email: targetEmail,
              name: "Mayank Bhandari",
              passwordHash: "",
              workspaceId: workspace.id,
            },
          });
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-local-dev-loop11",
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };