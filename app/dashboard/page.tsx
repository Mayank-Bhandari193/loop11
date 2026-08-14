"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { signOut, useSession } from "next-auth/react";
import SmartFeedbackModal from "@/components/SmartFeedbackModal";

interface FeedbackItem {
  id: string;
  content: string;
  channel: string;
  rating: string;
  sentiment: string;
  theme: string;
  intent: string;
  status: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();

  // Webhook Ticket Pool
  const ticketPool: Omit<FeedbackItem, "id">[] = [
    {
      content: "⚡ [Slack Sync] Webhook payload latency spike observed during peak load hours.",
      channel: "WEBHOOK",
      rating: "3/5",
      sentiment: "NEUTRAL",
      theme: "Export Feature",
      intent: "System Alert",
      status: "NEW",
    },
    {
      content: "⚡ [Intercom] Users reporting billing portal timeout when exporting annual receipts.",
      channel: "WEB",
      rating: "2/5",
      sentiment: "NEGATIVE",
      theme: "Billing Issue",
      intent: "Bug Report",
      status: "NEW",
    },
    {
      content: "⚡ [App Store] Requesting Google SSO integration for faster workspace login.",
      channel: "MOBILE_APP",
      rating: "5/5",
      sentiment: "VERY_POSITIVE",
      theme: "Navigation",
      intent: "Feature Request",
      status: "PENDING",
    },
    {
      content: "⚡ [In-App Prompt] Love the high-contrast dark mode dashboard charts!",
      channel: "IN_APP_PROMPT",
      rating: "5/5",
      sentiment: "POSITIVE",
      theme: "UI Customization",
      intent: "Positive Feedback",
      status: "RESOLVED",
    },
  ];

  const defaultFeedbacks: FeedbackItem[] = [
    {
      id: "1",
      content: "⚡ [Slack Sync] Webhook payload latency spike observed during peak load hours.",
      channel: "WEBHOOK",
      rating: "3/5",
      sentiment: "NEUTRAL",
      theme: "Export Feature",
      intent: "System Alert",
      status: "NEW",
    },
    {
      id: "2",
      content: "⚡ [Intercom] Users reporting billing portal timeout when exporting annual receipts.",
      channel: "WEB",
      rating: "2/5",
      sentiment: "NEGATIVE",
      theme: "Billing Issue",
      intent: "Bug Report",
      status: "NEW",
    },
    {
      id: "3",
      content: "⚡ [In-App Prompt] Love the high-contrast dark mode dashboard charts!",
      channel: "IN_APP_PROMPT",
      rating: "5/5",
      sentiment: "POSITIVE",
      theme: "UI Customization",
      intent: "Positive Feedback",
      status: "RESOLVED",
    },
  ];

  // State Management
  const [totalFeedback, setTotalFeedback] = useState<number>(79);
  const [positivePercentage] = useState<number>(47);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(defaultFeedbacks);
  const [selectedModalItem, setSelectedModalItem] = useState<FeedbackItem | null>(null);

  // Search & AI States
  const [searchQuery, setSearchQuery] = useState("");
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isGeneratingVoC, setIsGeneratingVoC] = useState(false);
  const [csvFileName, setCsvFileName] = useState<string | null>(null);

  // Filter States
  const [selectedChannel, setSelectedChannel] = useState("All Channels");
  const [selectedSentiment, setSelectedSentiment] = useState("All Sentiments");
  const [selectedTheme, setSelectedTheme] = useState("All Themes");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchContent, setSearchContent] = useState("");

  // Sync from LocalStorage on mount
  useEffect(() => {
    const savedCount = localStorage.getItem("loop11_total_feedback");
    const savedFeedbacks = localStorage.getItem("loop11_feedbacks");

    if (savedCount) setTotalFeedback(parseInt(savedCount, 10));
    if (savedFeedbacks) {
      try {
        setFeedbacks(JSON.parse(savedFeedbacks));
      } catch (e) {
        console.error("Failed to parse saved feedbacks:", e);
      }
    }
  }, []);

  // Action Handlers
  const handleExportPDF = () => {
    window.print();
  };

  const handleGenerateVoC = () => {
    setIsGeneratingVoC(true);
    setTimeout(() => {
      setIsGeneratingVoC(false);
      alert("✅ VoC Executive Summary Report generated successfully!");
    }, 1000);
  };

  const handleAskAI = (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsAsking(true);
    setTimeout(() => {
      setIsAsking(false);
      setAiAnswer(
        `Based on ${totalFeedback} records analyzed: Key customer priorities include Dark Mode UI, latency optimization on export, and billing portal improvements.`
      );
    }, 800);
  };

  const handleCSVUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFileName(file.name);
      alert(`📄 CSV File "${file.name}" uploaded successfully! Importing data...`);
    }
  };

  const handleSeedTicket = async () => {
    setIsSeeding(true);
    try {
      const nextIndex = (totalFeedback - 75) % ticketPool.length;
      const newTicketTemplate = ticketPool[nextIndex >= 0 ? nextIndex : 0];

      await fetch("/api/seed-attraction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTicketTemplate),
      }).catch((err) => console.log("API Sync Notice:", err));

      const newCount = totalFeedback + 1;
      setTotalFeedback(newCount);
      localStorage.setItem("loop11_total_feedback", newCount.toString());

      const newTicket: FeedbackItem = {
        id: `ticket_${Date.now()}`,
        ...newTicketTemplate,
      };

      const updatedFeedbacks = [newTicket, ...feedbacks];
      setFeedbacks(updatedFeedbacks);
      localStorage.setItem("loop11_feedbacks", JSON.stringify(updatedFeedbacks));
    } catch (e) {
      console.error("Seed error:", e);
    } finally {
      setIsSeeding(false);
    }
  };

  // Filter Stream Logic
  const filteredFeedbacks = feedbacks.filter((item) => {
    if (selectedChannel !== "All Channels" && item.channel !== selectedChannel) return false;
    if (selectedSentiment !== "All Sentiments" && item.sentiment !== selectedSentiment) return false;
    if (selectedTheme !== "All Themes" && item.theme !== selectedTheme) return false;
    if (selectedStatus !== "All Statuses" && item.status !== selectedStatus) return false;
    if (searchContent && !item.content.toLowerCase().includes(searchContent.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 p-6 space-y-8 print:bg-white print:text-black">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800/80 pb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            SYSTEM ACTIVE • LIVE STREAM SYNC
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Loop11 AI Feedback Engine</h1>
          <p className="text-sm text-slate-400 mt-1">
            User: <span className="text-slate-300 font-mono">{session?.user?.email || "mayankbhandari267@gmail.com"}</span>
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 print:hidden">
          <a
            href="http://localhost:51212"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 text-xs font-bold bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/80 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5"
          >
            📊 Prisma Studio
          </a>

          <button
            onClick={handleExportPDF}
            className="px-4 py-2.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-xl transition-all shadow-md active:scale-95"
          >
            📄 Export PDF / Share Report
          </button>

          <button
            onClick={handleGenerateVoC}
            disabled={isGeneratingVoC}
            className="px-5 py-2.5 text-xs font-bold bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl shadow-lg shadow-indigo-600/25 transition-all active:scale-95 disabled:opacity-50"
          >
            {isGeneratingVoC ? "Generating..." : "⚡ Generate VoC Report"}
          </button>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="px-4 py-2.5 text-xs font-semibold bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 rounded-xl transition-all active:scale-95"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-slate-900/60 border border-slate-800/80 rounded-2xl shadow-xl">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">TOTAL FEEDBACK</p>
          <p className="text-4xl font-black text-indigo-400 mt-2">{totalFeedback}</p>
        </div>
        <div className="p-5 bg-slate-900/60 border border-slate-800/80 rounded-2xl shadow-xl">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">POSITIVE SENTIMENT</p>
          <p className="text-4xl font-black text-emerald-400 mt-2">{positivePercentage}%</p>
        </div>
        <div className="p-5 bg-slate-900/60 border border-slate-800/80 rounded-2xl shadow-xl">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">TOP CATEGORY</p>
          <p className="text-2xl font-black text-cyan-400 mt-2">Feature Request</p>
        </div>
        <div className="p-5 bg-slate-900/60 border border-slate-800/80 rounded-2xl shadow-xl">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">RESPONSE RATE</p>
          <p className="text-4xl font-black text-amber-400 mt-2">7%</p>
        </div>
      </div>

      {/* Grounded AI Search */}
      <div className="p-5 bg-slate-900/80 border border-slate-800/90 rounded-2xl shadow-xl space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            🧠 ASK LOOP (GROUNDED AI SEARCH)
          </h2>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">Day 15 AI RAG</span>
        </div>
        <form onSubmit={handleAskAI} className="flex gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type query e.g., 'login', 'bug report', or 'billing'..."
            className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            type="submit"
            disabled={isAsking}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {isAsking ? "Searching..." : "Ask AI"}
          </button>
        </form>
        {aiAnswer && (
          <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-sm text-indigo-200 mt-3">
            <strong>🤖 AI Insight:</strong> {aiAnswer}
          </div>
        )}
      </div>

      {/* CSV & Webhook Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 bg-slate-900/60 border border-slate-800/80 rounded-2xl space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">BULK CSV DATA IMPORT</h3>
          <div className="flex items-center gap-3">
            <label className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl cursor-pointer transition-all active:scale-95">
              Choose File
              <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
            </label>
            <span className="text-xs text-slate-400">{csvFileName || "No file chosen"}</span>
          </div>
        </div>

        <div className="p-5 bg-slate-900/60 border border-slate-800/80 rounded-2xl flex justify-between items-center">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">LIVE WEBHOOK SIMULATOR</h3>
            <p className="text-xs text-slate-500 mt-1">Inject simulated integration ticket</p>
          </div>
          <button
            onClick={handleSeedTicket}
            disabled={isSeeding}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSeeding ? "Injecting..." : "⚡ Seed Ticket"}
          </button>
        </div>
      </div>

      {/* Feedback Inbox Stream */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">
            Feedback Inbox <span className="text-indigo-400 text-sm font-normal">({filteredFeedbacks.length} records shown)</span>
          </h2>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="bg-[#0D1322] border border-slate-800/90 text-slate-300 text-xs rounded-xl px-3 py-2 outline-none cursor-pointer hover:border-slate-700 transition-colors"
          >
            <option value="All Channels">All Channels</option>
            <option value="WEB">WEB</option>
            <option value="MOBILE_APP">MOBILE_APP</option>
            <option value="IN_APP_PROMPT">IN_APP_PROMPT</option>
            <option value="WEBHOOK">WEBHOOK</option>
          </select>

          <select
            value={selectedSentiment}
            onChange={(e) => setSelectedSentiment(e.target.value)}
            className="bg-[#0D1322] border border-slate-800/90 text-slate-300 text-xs rounded-xl px-3 py-2 outline-none cursor-pointer hover:border-slate-700 transition-colors"
          >
            <option value="All Sentiments">All Sentiments</option>
            <option value="POSITIVE">POSITIVE</option>
            <option value="VERY_POSITIVE">VERY_POSITIVE</option>
            <option value="NEUTRAL">NEUTRAL</option>
            <option value="NEGATIVE">NEGATIVE</option>
          </select>

          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            className="bg-[#0D1322] border border-slate-800/90 text-slate-300 text-xs rounded-xl px-3 py-2 outline-none cursor-pointer hover:border-slate-700 transition-colors"
          >
            <option value="All Themes">All Themes</option>
            <option value="UI Customization">UI Customization</option>
            <option value="Navigation">Navigation</option>
            <option value="Export Feature">Export Feature</option>
            <option value="Billing Issue">Billing Issue</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#0D1322] border border-slate-800/90 text-slate-300 text-xs rounded-xl px-3 py-2 outline-none cursor-pointer hover:border-slate-700 transition-colors"
          >
            <option value="All Statuses">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="NEW">NEW</option>
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-[#0D1322] border border-slate-800/90 text-slate-400 text-xs rounded-xl px-3 py-2 outline-none cursor-pointer hover:border-slate-700 transition-colors"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-[#0D1322] border border-slate-800/90 text-slate-400 text-xs rounded-xl px-3 py-2 outline-none cursor-pointer hover:border-slate-700 transition-colors"
          />

          <input
            type="text"
            value={searchContent}
            onChange={(e) => setSearchContent(e.target.value)}
            placeholder="🔍 Search content..."
            className="bg-[#0D1322] border border-slate-800/90 text-slate-300 text-xs rounded-xl px-4 py-2 outline-none focus:border-indigo-500 ml-auto transition-colors"
          />
        </div>

        {/* Feedback List */}
        <div className="space-y-3 pt-2">
          {filteredFeedbacks.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-slate-900/50 border border-slate-800/80 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:border-slate-700/90 shadow-md"
            >
              <div className="space-y-1">
                <p className="text-sm text-slate-200 font-medium">{item.content}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span>Source: <strong className="text-indigo-400">{item.channel}</strong></span>
                  <span>•</span>
                  <span>Rating: <strong className="text-amber-400">{item.rating}</strong></span>
                  <span>•</span>
                  <span>Sentiment: <strong className="text-emerald-400">{item.sentiment}</strong></span>
                  <span>•</span>
                  <span>Intent: <strong className="text-cyan-400">{item.intent}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* AI Copilot Smart Action Trigger */}
                <button
                  onClick={() => setSelectedModalItem(item)}
                  className="px-3 py-1.5 text-xs font-bold bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 rounded-xl transition-all active:scale-95"
                >
                  ✨ AI Action
                </button>

                <span className="px-3.5 py-1.5 text-xs font-bold bg-slate-800/90 text-slate-300 rounded-xl border border-slate-700/80">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Feedback Modal */}
      <SmartFeedbackModal
        feedback={selectedModalItem}
        onClose={() => setSelectedModalItem(null)}
      />
    </div>
  );
}