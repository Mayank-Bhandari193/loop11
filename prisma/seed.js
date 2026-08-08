const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  console.log("🚀 Starting database seeding for Prisma Studio...");
  // 1. Resolve Workspace
  let workspace = await prisma.workspace.findFirst();
  if (!workspace) {
    workspace = await prisma.workspace.create({
      data: { name: "Default Workspace" },
    });
  }
  // 2. Resolve User
  let user = await prisma.user.findFirst({
    where: { email: "mayankbhandari267@gmail.com" },
  });
  if (!user) {
    user = await prisma.user.findFirst();
  }
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: "mayankbhandari267@gmail.com",
        name: "Mayank Bhandari",
        workspaceId: workspace.id,
      },
    });
  }
  // 3. Populate FeatureAttraction Records
  const featureList = [
    {
      title: "Dark Mode & Custom Tag Filters",
      description: "High contrast dark mode dashboard charts and custom tag filters in inbox.",
      totalVotes: 50,
    },
    {
      title: "Google SSO & Multi-Tenant RBAC",
      description: "OAuth 2.0 authentication with role-based workspace permissions.",
      totalVotes: 38,
    },
    {
      title: "Automated Executive VoC PDF Export",
      description: "One-click printable Voice-of-Customer PDF report synthesis.",
      totalVotes: 29,
    },
    {
      title: "Grounded AI RAG Search ('Ask LOOP')",
      description: "Contextual natural language search over customer feedback.",
      totalVotes: 42,
    },
    {
      title: "Live Webhook Ticket Stream Sync",
      description: "Real-time ticket ingestion pipeline with automatic sentiment tagging.",
      totalVotes: 35,
    },
  ];
  const createdFeatures = [];
  for (const item of featureList) {
    const feat = await prisma.featureAttraction.create({
      data: item,
    });
    createdFeatures.push(feat);
  }
  console.log(`✅ ${createdFeatures.length} FeatureAttraction records inserted!`);
  // 4. Populate 50 Feedback & FeedbackAttraction Relational Records
  const channels = ["WEB", "MOBILE_APP", "IN_APP_PROMPT", "WEBHOOK"];
  const sentiments = ["VERY_POSITIVE", "POSITIVE", "NEUTRAL", "NEGATIVE"];
  console.log("⏳ Inserting 50 FeedbackAttraction relational rows...");
  for (let i = 1; i <= 50; i++) {
    const chosenFeature = createdFeatures[(i - 1) % createdFeatures.length];
    const channel = channels[i % channels.length];
    const sentiment = sentiments[i % sentiments.length];
    const feedback = await prisma.feedback.create({
      data: {
        content: `⚡ [#${i}] Simulated customer feedback ticket for ${chosenFeature.title}`,
        sentiment: sentiment,
        workspaceId: workspace.id,
      },
    });
    await prisma.feedbackAttraction.create({
      data: {
        featureAttractionId: chosenFeature.id,
        feedbackId: feedback.id,
        userId: user.id,
      },
    });
  }
  console.log("🎉 SUCCESS: 50 FeedbackAttraction entries successfully created!");
}
main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });