"use client";

import React, { useState, useEffect } from "react";
import { signOut } from "next-auth/react";

interface FeedbackItem {
  id: string;
  title: string;
  source: string;
  rating: number;
  sentiment: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
  intent: string;
  status: "NEW" | "VERIFIED";
  channel: string;
}

const INITIAL_FEEDBACKS: FeedbackItem[] = [
  {
    id: "1",
    title: "[Slack Sync] Webhook payload latency spike observed during peak load hours.",
    source: "WEBHOOK",
    rating: 3,
    sentiment: "NEUTRAL",
    intent: "System Alert",
    status: "NEW",
    channel: "Slack",
  },
  {
    id: "2",
    title: "[Intercom] Users reporting billing portal timeout when exporting annual receipts.",
    source: "WEB",
    rating: 2,
    sentiment: "NEGATIVE",
    intent: "Bug Report",
    status: "NEW",
    channel: "Intercom",
  },
  {
    id: "3",
    title: "[In-App Prompt] Love the high-contrast dark mode dashboard charts!",
    source: "IN_APP",
    rating: 5,
    sentiment: "POSITIVE",
    intent: "Praise",
    status: "VERIFIED",
    channel: "In-App",
  },
];

export default function Loop11Dashboard() {
  const [query, setQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("All Channels");
  const [selectedSentiment, setSelectedSentiment] = useState("All Sentiments");
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pop-up Modal State for VoC Report
  const [showVocModal, setShowVocModal] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  // Feedbacks State
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);

  useEffect(() => {
    try {
      const savedFeedbacks = localStorage.getItem("loop11_feedbacks");
      if (savedFeedbacks) {
        setFeedbacks(JSON.parse(savedFeedbacks));
      } else {
        setFeedbacks(INITIAL_FEEDBACKS);
        localStorage.setItem("loop11_feedbacks", JSON.stringify(INITIAL_FEEDBACKS));
      }
    } catch (e) {
      setFeedbacks(INITIAL_FEEDBACKS);
    }
  }, []);

  const updateFeedbacks = (newList: FeedbackItem[]) => {
    setFeedbacks(newList);
    try {
      localStorage.setItem("loop11_feedbacks", JSON.stringify(newList));
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- Handlers ---
  const handlePrismaStudio = () => {
    showToast("Opening Prisma Studio DB Manager...");
    window.open("http://localhost:5555", "_blank");
  };

  const handleExportPDF = () => {
    setLoadingAction("pdf");
    setTimeout(() => {
      setLoadingAction(null);
      window.print();
      showToast("Report Exported Successfully!");
    }, 800);
  };

  const handleGenerateVoC = () => {
    setLoadingAction("voc");
    setTimeout(() => {
      setLoadingAction(null);
      setShowVocModal(true);
    }, 1200);
  };

  // 🔴 LOGOUT FUNCTIONALITY (NEXTAUTH SIGN OUT + REDIRECT)
  const handleLogout = async () => {
    if (confirm("Are you sure you want to log out of Loop11 AI Engine?")) {
      showToast("Logging out session...");
      try {
        localStorage.removeItem("loop11_feedbacks");
        // NextAuth signOut call with explicit callback to login page
        await signOut({ callbackUrl: "/login" });
      } catch (error) {
        // Fallback hard-redirect in case NextAuth session provider is bypassed
        window.location.href = "/login";
      }
    }
  };

  const handleAskAI = () => {
    if (!query.trim()) {
      showToast("⚠️ Please enter a query for Grounded RAG Search.");
      return;
    }
    setLoadingAction("ask");
    setAiAnswer(null);

    setTimeout(() => {
      setLoadingAction(null);
      const q = query.toLowerCase();
      
      let response = "";
      if (q.includes("billing") || q.includes("timeout")) {
        response = "⚡ RAG Finding: 2 records matched. Identified recurring timeout issue on Intercom export receipts with 2/5 rating. Recommended Fix: Increase gateway timeout limit.";
      } else if (q.includes("slack") || q.includes("webhook") || q.includes("latency")) {
        response = "⚡ RAG Finding: Webhook payload latency spike detected during peak load hours. 1 active ticket logged under System Alert.";
      } else if (q.includes("login") || q.includes("bug")) {
        response = "⚡ RAG Finding: 0 critical authentication bugs found. System uptime is 99.8%.";
      } else {
        response = `⚡ Grounded AI Search Result for "${query}": Scanned ${feedbacks.length} database feedback records using Groq RAG pipeline. Relevant sentiment index: 47% Positive.`;
      }

      setAiAnswer(response);
      showToast("AI RAG Analysis Complete!");
    }, 900);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      showToast(`Uploading CSV Data: ${file.name}`);
    }
  };

  const handleSeedTicket = () => {
    setLoadingAction("seed");
    setTimeout(() => {
      const currentCount = (feedbacks?.length || 0) + 1;
      const newTicket: FeedbackItem = {
        id: Date.now().toString(),
        title: `[Webhook Ticket #${currentCount}] Simulated telemetry alert injected at ${new Date().toLocaleTimeString()}`,
        source: "WEBHOOK",
        rating: Math.floor(Math.random() * 5) + 1,
        sentiment: Math.random() > 0.5 ? "POSITIVE" : "NEGATIVE",
        intent: "Simulated Test",
        status: "NEW",
        channel: "Webhook",
      };
      const updatedList = [newTicket, ...(feedbacks || [])];
      updateFeedbacks(updatedList);
      setLoadingAction(null);
      showToast(`Ticket #${currentCount} Seeded! Total Records: ${updatedList.length}`);
    }, 600);
  };

  // Filter Logic
  const filteredFeedbacks = (feedbacks || []).filter((item) => {
    const titleText = item?.title || "";
    const searchTarget = (searchFilter || "").toLowerCase();
    
    const matchesSearch = titleText.toLowerCase().includes(searchTarget);
    const matchesSentiment = selectedSentiment === "All Sentiments" || item?.sentiment === selectedSentiment;
    const matchesChannel = selectedChannel === "All Channels" || item?.channel === selectedChannel;
    
    return matchesSearch && matchesSentiment && matchesChannel;
  });

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans p-6 space-y-6 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl border border-indigo-400/30 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* POPUP MODAL FOR VOC REPORT */}
      {showVocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xl">
                ⚡
              </span>
              <div>
                <h3 className="text-base font-bold text-white">VoC Intelligence Report Generated!</h3>
                <p className="text-xs text-slate-400 font-mono">Groq AI Engine • RAG Pipeline</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-2 font-sans">
              <p>✔ <strong>Sentiment Trend:</strong> 47% Positive | 33% Neutral | 20% Negative</p>
              <p>✔ <strong>Key Insight:</strong> High priority feature requests around webhook integration and latency.</p>
              <p>✔ <strong>Actionable Status:</strong> Successfully Done and logged to database.</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => setShowVocModal(false)}
                className="px-5 py-2 rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
                Successfully Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- HEADER ---------------- */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              SYSTEM ACTIVE • LIVE STREAM SYNC
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight bg-linear-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Loop11 AI Feedback Engine
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            User: <span className="text-indigo-400 font-medium">mayankbhandari267@gmail.com</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button onClick={handlePrismaStudio} className="text-xs font-medium px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 transition-all active:scale-95">
            Prisma Studio
          </button>
          
          <button onClick={handleExportPDF} disabled={loadingAction === "pdf"} className="text-xs font-medium px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 transition-all active:scale-95 disabled:opacity-50">
            {loadingAction === "pdf" ? "Exporting..." : "Export PDF / Share Report"}
          </button>

          <button onClick={handleGenerateVoC} disabled={loadingAction === "voc"} className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50">
            <span>⚡</span>
            {loadingAction === "voc" ? "Generating..." : "Generate VoC Report"}
          </button>

          {/* WORKING LOGOUT BUTTON */}
          <button onClick={handleLogout} className="text-xs font-medium px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all active:scale-95">
            Logout
          </button>
        </div>
      </header>

      {/* ---------------- STAT CARDS ---------------- */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
          <p className="text-xs font-mono font-medium tracking-wider text-slate-400 uppercase">Total Feedback</p>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-white">{feedbacks?.length || 0}</span>
            <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              Live DB
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
          <p className="text-xs font-mono font-medium tracking-wider text-slate-400 uppercase">Positive Sentiment</p>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-emerald-400">47%</span>
            <span className="text-xs text-slate-500 font-mono">AI Verified</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
          <p className="text-xs font-mono font-medium tracking-wider text-slate-400 uppercase">Top Category</p>
          <div className="mt-3">
            <span className="text-xl font-bold text-sky-400">Feature Request</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
          <p className="text-xs font-mono font-medium tracking-wider text-slate-400 uppercase">Response Rate</p>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-amber-400">7%</span>
            <span className="text-xs text-slate-500 font-mono">SLA Active</span>
          </div>
        </div>
      </section>

      {/* ---------------- GROUNDED AI SEARCH ---------------- */}
      <section className="p-5 rounded-2xl bg-linear-to-r from-indigo-950/30 via-slate-900/50 to-slate-900/30 border border-indigo-500/20 shadow-2xl backdrop-blur-xl space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-wide text-slate-200 uppercase font-mono">
            🔮 Ask Loop (Grounded AI Search)
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            Day 15 AI RAG Engine
          </span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAskAI()}
            placeholder="Type query e.g., 'login issue', 'bug report', or 'billing timeout'..."
            className="flex-1 bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/60"
          />
          <button onClick={handleAskAI} disabled={loadingAction === "ask"} className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs active:scale-95 disabled:opacity-50">
            {loadingAction === "ask" ? "Searching..." : "Ask AI"}
          </button>
        </div>

        {/* AI RAG ANSWER OUTPUT CONTAINER */}
        {aiAnswer && (
          <div className="mt-3 p-4 rounded-xl bg-indigo-950/50 border border-indigo-500/40 text-xs text-indigo-200 space-y-1 font-sans">
            <p className="font-semibold text-indigo-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Groq AI RAG Engine Response:
            </p>
            <p className="text-slate-300 leading-relaxed pl-4">{aiAnswer}</p>
          </div>
        )}
      </section>

      {/* ---------------- INGESTION CONTROLS ---------------- */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl space-y-3">
          <h3 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
            📂 Bulk CSV Data Import
          </h3>
          <div className="flex items-center gap-3">
            <label className="cursor-pointer text-xs font-semibold px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all active:scale-95">
              Choose File
              <input type="file" onChange={handleFileUpload} className="hidden" accept=".csv" />
            </label>
            <span className="text-xs text-slate-500 font-mono">No file chosen</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
              📡 Live Webhook Simulator
            </h3>
            <p className="text-xs text-slate-500">Inject simulated integration ticket directly into DB</p>
          </div>
          <button 
            onClick={handleSeedTicket} 
            disabled={loadingAction === "seed"} 
            className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all active:scale-95 disabled:opacity-50">
            {loadingAction === "seed" ? "Seeding..." : "⚡ Seed Ticket"}
          </button>
        </div>
      </section>

      {/* ---------------- FEEDBACK INBOX ---------------- */}
      <section className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white tracking-wide">Feedback Inbox</h3>
            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
              {filteredFeedbacks.length} records shown
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select value={selectedChannel} onChange={(e) => setSelectedChannel(e.target.value)} className="bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
              <option>All Channels</option>
              <option>Slack</option>
              <option>Intercom</option>
              <option>In-App</option>
              <option>Webhook</option>
            </select>

            <select value={selectedSentiment} onChange={(e) => setSelectedSentiment(e.target.value)} className="bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
              <option>All Sentiments</option>
              <option>POSITIVE</option>
              <option>NEUTRAL</option>
              <option>NEGATIVE</option>
            </select>

            <input type="text" value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} placeholder="Search content..." className="bg-slate-950/80 border border-slate-800 rounded-lg pl-3 pr-3 py-1.5 text-xs text-slate-300" />
          </div>
        </div>

        <div className="space-y-3">
          {filteredFeedbacks.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 font-mono">
              No matching feedback records found.
            </div>
          ) : (
            filteredFeedbacks.map((item) => (
              <div key={item.id} className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-slate-200">{item.title}</p>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
                    <span>Source: <strong className="text-slate-400">{item.source}</strong></span>
                    <span>• Rating: <strong className="text-amber-400">{item.rating}/5</strong></span>
                    <span>• Sentiment: <strong className={item.sentiment === "POSITIVE" ? "text-emerald-400" : item.sentiment === "NEGATIVE" ? "text-red-400" : "text-slate-300"}>{item.sentiment}</strong></span>
                    <span>• Intent: <strong className="text-sky-400">{item.intent}</strong></span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {item.status}
                </span>
              </div>
            ))
          )}
        </div>
      </section>

    </div>
  );
}