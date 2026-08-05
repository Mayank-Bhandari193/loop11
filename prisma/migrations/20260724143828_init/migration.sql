-- CreateEnum
CREATE TYPE "Sentiment" AS ENUM ('VERY_POSITIVE', 'POSITIVE', 'NEUTRAL', 'NEGATIVE', 'VERY_NEGATIVE');

-- CreateEnum
CREATE TYPE "FeedbackStatus" AS ENUM ('PENDING', 'PROCESSING', 'RESOLVED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "FeedbackSource" AS ENUM ('WEB', 'MOBILE_APP', 'EMAIL', 'IN_APP_PROMPT');

-- CreateEnum
CREATE TYPE "Urgency" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "content" TEXT NOT NULL,
    "rating" INTEGER,
    "source" "FeedbackSource" NOT NULL DEFAULT 'WEB',
    "status" "FeedbackStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiAnalysis" (
    "id" TEXT NOT NULL,
    "feedbackId" TEXT NOT NULL,
    "sentiment" "Sentiment" NOT NULL DEFAULT 'NEUTRAL',
    "sentimentScore" DOUBLE PRECISION NOT NULL,
    "summary" TEXT,
    "intent" TEXT,
    "urgencyLevel" "Urgency" NOT NULL DEFAULT 'MEDIUM',
    "tags" TEXT[],
    "analyzedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureAttraction" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "totalVotes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeatureAttraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedbackAttraction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "featureAttractionId" TEXT NOT NULL,
    "feedbackId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeedbackAttraction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Feedback_userId_idx" ON "Feedback"("userId");

-- CreateIndex
CREATE INDEX "Feedback_status_idx" ON "Feedback"("status");

-- CreateIndex
CREATE UNIQUE INDEX "AiAnalysis_feedbackId_key" ON "AiAnalysis"("feedbackId");

-- CreateIndex
CREATE UNIQUE INDEX "FeatureAttraction_title_key" ON "FeatureAttraction"("title");

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackAttraction_userId_featureAttractionId_key" ON "FeedbackAttraction"("userId", "featureAttractionId");

-- AddForeignKey
ALTER TABLE "AiAnalysis" ADD CONSTRAINT "AiAnalysis_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "Feedback"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackAttraction" ADD CONSTRAINT "FeedbackAttraction_featureAttractionId_fkey" FOREIGN KEY ("featureAttractionId") REFERENCES "FeatureAttraction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackAttraction" ADD CONSTRAINT "FeedbackAttraction_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "Feedback"("id") ON DELETE SET NULL ON UPDATE CASCADE;
