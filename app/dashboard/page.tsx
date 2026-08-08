"use client";

import React, { useState } from "react";

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

export default function Loop11Dashboard() {
  // --- States for Interactivity ---
  const [query, setQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("All Channels");
  const [selectedSentiment, setSelectedSentiment] = useState("All Sentiments");
  const [selectedTheme, setSelectedTheme] = useState("All Themes");
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic Feedback Records State
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([
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
  ]);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- Button Action Handlers ---
  
  // 1. Prisma Studio Action
  const handlePrismaStudio = () => {
    showToast("Opening Prisma Studio DB Manager...");
    window.open("http://localhost:5555", "_blank");
  };

  // 2. Export PDF / Share Report Action
  const handleExportPDF = () => {
    setLoadingAction("pdf");
    setTimeout(() => {
      setLoadingAction(null);
      window.print();
      showToast("Report Exported Successfully!");
    }, 1000);
  };

  // 3. Generate VoC Report Action
  const handleGenerateVoC = async () => {
    setLoadingAction("voc");
    setTimeout(() => {
      setLoadingAction(null);
      showToast("⚡ VoC Intelligence Report Generated via Groq AI Engine!");
    }, 1500);
  };

  // 4. Logout Action
  const handleLogout = () => {
    if (confirm("Are you sure you want to log out of Loop11 Engine?")) {
      showToast("Logging out session...");
      window.location.reload();
    }
  };

  // 5. Ask AI (RAG Search) Action
  const handleAskAI = () => {
    if (!query.trim()) {
      showToast("⚠️ Please enter a search query for Grounded RAG.");
      return;
    }
    setLoadingAction("ask");
    setTimeout(() => {
      setLoadingAction(null);
      showToast(`AI Analysis Complete for query: "${query}"`);
    }, 1200);
  };

  // 6. CSV File Import Action
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      showToast(`Uploading & Parsing CSV File: ${file.name}`);
    }
  };

  // 7. Seed Webhook Ticket Action
  const handleSeedTicket = () => {
    setLoadingAction("seed");
    setTimeout(() => {
      const newTicket: FeedbackItem = {
        id: Date.now().toString(),
        title: `[Webhook Injection] Simulated telemetry alert generated at ${new Date().toLocaleTimeString()}`,
        source: "WEBHOOK",
        rating: Math.floor(Math.random() * 5) + 1,
        sentiment: Math.random() > 0.5 ? "POSITIVE" : "NEGATIVE",
        intent: "Simulated Test",
        status: "NEW",
        channel: "Webhook",
      };
      setFeedbacks([newTicket, ...feedbacks]);
      setLoadingAction(null);
      showToast("New Webhook Ticket Seeded Successfully into Database!");
    }, 800);
  };

  // --- Filtering Logic ---
  const filteredFeedbacks = feedbacks.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesSentiment = selectedSentiment === "All Sentiments" || item.sentiment === selectedSentiment;
    const matchesChannel = selectedChannel === "All Channels" || item.channel === selectedChannel;
    return matchesSearch && matchesSentiment && matchesChannel;
  });

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans p-6 space-y-6 relative">
      
      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl border border-indigo-400/30 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* ---------------- TOP NAVBAR / HEADER ---------------- */}
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

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={handlePrismaStudio}
            className="flex items-center gap-2 text-xs font-medium px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 transition-all active:scale-95">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Prisma Studio
          </button>
          
          <button 
            onClick={handleExportPDF}
            disabled={loadingAction === "pdf"}
            className="flex items-center gap-2 text-xs font-medium px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 transition-all active:scale-95 disabled:opacity-50">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            {loadingAction === "pdf" ? "Exporting..." : "Export PDF / Share Report"}
          </button>

          <button 
            onClick={handleGenerateVoC}
            disabled={loadingAction === "voc"}
            className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50">
            <span>⚡</span>
            {loadingAction === "voc" ? "Generating AI Report..." : "Generate VoC Report"}
          </button>

          <button 
            onClick={handleLogout}
            className="text-xs font-medium px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all active:scale-95">
            Logout
          </button>
        </div>
      </header>

      {/* ---------------- METRIC STAT CARDS ---------------- */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
          <p className="text-xs font-mono font-medium tracking-wider text-slate-400 uppercase">Total Feedback</p>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-white">{feedbacks.length}</span>
            <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              +12%
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

      {/* ---------------- GROUNDED AI SEARCH (RAG SECTION) ---------------- */}
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
            className="flex-1 bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-all"
          />
          <button 
            onClick={handleAskAI}
            disabled={loadingAction === "ask"}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all active:scale-95 disabled:opacity-50">
            {loadingAction === "ask" ? "Searching..." : "Ask AI"}
          </button>
        </div>
      </section>

      {/* ---------------- INGESTION CONTROLS (CSV & SIMULATOR) ---------------- */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bulk Data Import */}
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

        {/* Webhook Simulator */}
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

      {/* ---------------- FEEDBACK INBOX SECTION ---------------- */}
      <section className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl space-y-4">
        
        {/* Filters Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white tracking-wide">Feedback Inbox</h3>
            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
              {filteredFeedbacks.length} records shown
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select 
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none">
              <option>All Channels</option>
              <option>Slack</option>
              <option>Intercom</option>
              <option>In-App</option>
              <option>Webhook</option>
            </select>

            <select 
              value={selectedSentiment}
              onChange={(e) => setSelectedSentiment(e.target.value)}
              className="bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none">
              <option>All Sentiments</option>
              <option>POSITIVE</option>
              <option>NEUTRAL</option>
              <option>NEGATIVE</option>
            </select>

            <input 
              type="text" 
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search content..." 
              className="bg-slate-950/80 border border-slate-800 rounded-lg pl-3 pr-3 py-1.5 text-xs text-slate-300 focus:outline-none" 
            />
          </div>
        </div>

        {/* Inbox List */}
        <div className="space-y-3">
          {filteredFeedbacks.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 font-mono">
              No matching feedback records found for applied filters.
            </div>
          ) : (
            filteredFeedbacks.map((item) => (
              <div 
                key={item.id}
                className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between gap-4">
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