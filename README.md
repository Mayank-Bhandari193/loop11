# ⚡ LOOP11 — AI Customer-Feedback Intelligence Platform

> An enterprise-grade, multi-tenant feedback analytics engine that ingests, classifies, and converts scattered customer feedback streams into evidence-backed product roadmaps using Large Language Models (LLMs).

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-blue?style=for-the-badge&logo=vercel)](https://loop11.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Mayank-Bhandari193/loop11)
[![Database](https://img.shields.io/badge/Database-Neon_PostgreSQL-00E599?style=for-the-badge&logo=postgresql)](https://neon.tech)
[![AI Engine](https://img.shields.io/badge/AI_Engine-Groq_Llama--3.3--70B-F05A28?style=for-the-badge)](https://groq.com)

---

## 🌐 Live Application Links

* **🚀 Landing Page / Live App:** [https://loop11.vercel.app](https://loop11.vercel.app)[cite: 1]
* **📝 SignUp Screen:** [https://loop11.vercel.app/signup](https://loop11.vercel.app/signup)[cite: 2]
* **🔐 Login Screen:** [https://loop11.vercel.app/login](https://loop11.vercel.app/login)[cite: 3]
* **📊 Analytics Dashboard:** [https://loop11.vercel.app/dashboard](https://loop11.vercel.app/dashboard)[cite: 4]
## 🌟 What's New in the Latest Release

* **🔒 Next.js Edge Middleware Auth Guard (`middleware.ts`):** Complete server-level route protection for `/dashboard`, `/inbox`, `/ask`, and `/reports`. Instant and secure session revocation on logout with auto-redirect to `/login`.
* **📊 100 Synchronized Records & Real-Time Sync:** Full parity between the **Total Feedback Metric Card** and the **Inbox Stream** (100 Initial records with real-time dynamic count increments upon simulated ticket injection).
* **🧠 Context-Aware "Ask LOOP" Semantic Intelligence:** Grounded conversational search that dynamically recognizes queries regarding authentication, billing, dark mode UI, bug reports, and executive VoC summaries with citation metrics.
* **✨ AI Copilot Smart Reply & Churn Risk Action (`SmartFeedbackModal.tsx`):** Context-aware churn detection (`CRITICAL`, `HIGH`, `LOW`), product root cause extraction, and 1-click empathetic reply generation.

---

## 🏗️ Architecture & Project Directory Structure

```text
loop11/
├── 🛡️ SECURITY & CONFIGURATION
│   ├── middleware.ts                  # Server-side Auth Guard & Redirect Interceptor
│   ├── prisma.config.ts               # Prisma v6 Driver Adapter Configuration
│   ├── tsconfig.json                  # TypeScript Compiler Settings
│   └── package.json                   # Scripts (Concurrently runs Next.js + Studio)
│
├── 🎨 FRONTEND ARCHITECTURE (/app, /components)
│   ├── app/
│   │   ├── dashboard/page.tsx         # Real-time Synchronized Analytics Dashboard
│   │   ├── login/page.tsx             # NextAuth Credentials Authentication Screen
│   │   ├── signup/page.tsx            # Multi-Tenant Workspace User Registration
│   │   ├── unauthorized/page.tsx      # RBAC Access Guard Fallback View
│   │   ├── globals.css                # Tailwind CSS & Dark Mode Custom Utilities
│   │   └── layout.tsx                 # Root Layout & Client Session Provider Setup
│   └── components/
│       ├── SmartFeedbackModal.tsx     # AI Churn Risk & Copilot Reply Modal
│       ├── InteractiveFeedbackWidget.tsx # Customer Tag Chips & Upvoting Widget
│       ├── Navbar.tsx                 # Header Navigation & Status Indicators
│       ├── Skeleton.tsx               # High-Contrast Dynamic Loading Skeletons
│       └── Toast.tsx                  # Action Toast Notifications
│
├── ⚙️ BACKEND ARCHITECTURE (/app/api, /prisma, /lib)
│   ├── app/api/
│   │   ├── feedback/smart-reply/route.ts # AI Churn Analysis & Response Generator
│   │   ├── seed-attraction/route.ts   # Live Webhook Ticket Injection API
│   │   ├── ask/route.ts               # Grounded AI Search (RAG) API
│   │   ├── reports/voc/route.ts       # Executive Voice-of-Customer PDF API
│   │   └── auth/[...nextauth]/route.ts# NextAuth JWT & Multi-Tenant Session Handlers
│   ├── prisma/
│   │   └── schema.prisma              # PostgreSQL Multi-Tenant Relational Schema
│   └── lib/
│       ├── prisma.ts                  # Neon Serverless Prisma Client Singleton
│       └── groq.ts                    # Groq SDK Configuration & JSON Prompt Schema
│
└── 📂 PUBLIC ASSETS
    └── public/                        # Static Branding, Icons & SVG Graphics
🚀 Getting Started
1. Clone & Install Dependencies
Bash
git clone [https://github.com/Mayank-Bhandari193/loop11.git](https://github.com/Mayank-Bhandari193/loop11.git)
cd loop11

# Install core runtime dependencies
npm install @prisma/client@latest @prisma/adapter-neon @neondatabase/serverless ws next-auth zod recharts papaparse groq-sdk

# Install development dependencies
npm install -D prisma@latest typescript @types/node @types/react @types/react-dom @types/ws concurrently tsx
2. Configure Environment Variables (.env)
Create a .env file in the root directory:

Code snippet
# Neon Serverless PostgreSQL Database Connection
DATABASE_URL="postgresql://<user>:<password>@<ep-cool-db>.us-east-1.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://<user>:<password>@<ep-cool-db>.us-east-1.aws.neon.tech/neondb?sslmode=require"

# NextAuth Secret & Base URL
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-min-32-characters"

# Groq LLM Inference API Key
GROQ_API_KEY="gsk_your_groq_api_key_here"
3. Database Migration & Prisma Client
Bash
# Push Prisma Schema to Neon Database
npx prisma db push

# Generate Prisma Client
npx prisma generate
4. Run Development Environment
Run both the Next.js Web Application and Prisma Studio Visualizer simultaneously:

Bash
npm run dev
🌐 Web Dashboard: http://localhost:3000

🗄️ Prisma Studio: http://localhost:51212

🧩 Core Platform Capabilities
Feature	Description
Grounded AI RAG Search	
Natural language queries executed against context retrieved from the database to eliminate hallucinations.  
PDF
+ 1

AI Smart Reply & Copilot	Automatically flags ticket churn risk, recommends product action, and drafts customer replies.
Live Webhook Simulator	⚡ Seed Ticket pushes simulated incoming tickets with real-time multi-metric synchronization.
Executive VoC Reports	
1-Click automated generation of executive summaries with a print-ready PDF export view[cite: 1, 2].

Multi-Tenant Isolation	
Strict workspace-level boundary filtering applied to all feedback and query records[cite: 1, 2].

👥 Engineering & Contributor Team
Mayank Bhandari — Full-Stack Lead & Core Developer  
PPTX

S Manjunath Naidu — QA Lead & Database Optimization  
PPTX

Harshini R B — Technical Debugger & UX Hardening  
PPTX

📄 License & Deployment
Deployed continuously to Vercel with automated CI/CD checks[cite: 1, 2]. Built under the MIT License.


---

### 📤 Git Push Commands:

```bash
git add README.md
git commit -m "docs: rewrite README with full architecture, middleware auth, and latest features"
git push origin main

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying app/page.tsx. The page auto-updates as you edit the file.

This project uses [next/font](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
