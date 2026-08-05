import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Populating FeatureAttraction and FeedbackAttraction...');

  // 1. Clean old entries to avoid unique constraint issues
  await prisma.feedbackAttraction.deleteMany();
  await prisma.featureAttraction.deleteMany();

  // 2. Fetch existing Users and Feedbacks from Neon DB
  const users = await prisma.user.findMany();
  const feedbacks = await prisma.feedback.findMany();

  if (users.length === 0 || feedbacks.length === 0) {
    console.log('❌ Please ensure User and Feedback tables have entries first.');
    return;
  }

  const user1 = users[0];
  const user2 = users[1] || users[0];
  const feedback1 = feedbacks[0];
  const feedback2 = feedbacks[1] || feedbacks[0];

  // 3. Populate FeatureAttraction Table
  const feature1 = await prisma.featureAttraction.create({
    data: {
      title: 'Slack Real-Time Notifications Integration',
      description: 'Instant Slack alerts for high-urgency customer bugs and critical feedback.',
      totalVotes: 2,
    },
  });

  const feature2 = await prisma.featureAttraction.create({
    data: {
      title: 'Dark Mode UI Toggle in Inbox',
      description: 'High contrast dark themes for better night-time feedback monitoring.',
      totalVotes: 1,
    },
  });

  // 4. Populate FeedbackAttraction (Junction/Voting Table)
  await prisma.feedbackAttraction.createMany({
    data: [
      {
        userId: user1.id,
        featureAttractionId: feature1.id,
        feedbackId: feedback1.id,
      },
      {
        userId: user2.id,
        featureAttractionId: feature1.id,
        feedbackId: feedback2.id,
      },
      {
        userId: user1.id,
        featureAttractionId: feature2.id,
        feedbackId: feedback1.id,
      },
    ],
  });

  console.log('✅ FeatureAttraction & FeedbackAttraction successfully populated!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });