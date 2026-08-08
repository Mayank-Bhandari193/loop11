"use client";

import React, { useState } from "react";
// Simple local icon placeholders to avoid dependency on 'lucide-react'
const Icon = ({ children, className }: { children?: any; className?: string }) => (
  <span className={className} aria-hidden>
    {children ?? (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" />
      </svg>
    )}
  </span>
);

const BarChart3 = (props: any) => <Icon {...props} />;
const Sparkles = (props: any) => <Icon {...props} />;
const FileText = (props: any) => <Icon {...props} />;
const Database = (props: any) => <Icon {...props} />;
const Radio = (props: any) => <Icon {...props} />;
const Upload = (props: any) => <Icon {...props} />;
const Search = (props: any) => <Icon {...props} />;
const Filter = (props: any) => <Icon {...props} />;
const ShieldCheck = (props: any) => <Icon {...props} />;
const Zap = (props: any) => <Icon {...props} />;
const ArrowUpRight = (props: any) => <Icon {...props} />;
const CheckCircle2 = (props: any) => <Icon {...props} />;

export default function Loop11Dashboard() {
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans p-6 space-y-6">
      
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

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 text-xs font-medium px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 transition-all hover:scale-[1.02]">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            Prisma Studio
          </button>
          
          <button className="flex items-center gap-2 text-xs font-medium px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 transition-all hover:scale-[1.02]">
            <FileText className="w-3.5 h-3.5 text-sky-400" />
            Export PDF / Share Report
          </button>

          <button className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            Generate VoC Report
          </button>

          <button className="text-xs font-medium px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all">
            Logout
          </button>
        </div>
      </header>

      {/* ---------------- METRIC METRICS / STAT CARDS ---------------- */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Feedback */}
        <div className="relative overflow-hidden p-5 rounded-2xl bg-linear-to-b from-slate-900/80 to-slate-900/30 border border-slate-800/80 shadow-xl backdrop-blur-md group hover:border-slate-700 transition-all">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />
          <p className="text-xs font-mono font-medium tracking-wider text-slate-400 uppercase">Total Feedback</p>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-white tracking-tight">75</span>
            <span className="flex items-center text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +12%
            </span>
          </div>
        </div>

        {/* Positive Sentiment */}
        <div className="relative overflow-hidden p-5 rounded-2xl bg-linear-to-b from-slate-900/80 to-slate-900/30 border border-slate-800/80 shadow-xl backdrop-blur-md group hover:border-emerald-500/30 transition-all">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
          <p className="text-xs font-mono font-medium tracking-wider text-slate-400 uppercase">Positive Sentiment</p>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-emerald-400 tracking-tight">47%</span>
            <span className="text-xs text-slate-500">AI Verified</span>
          </div>
        </div>

        {/* Top Category */}
        <div className="relative overflow-hidden p-5 rounded-2xl bg-linear-to-b from-slate-900/80 to-slate-900/30 border border-slate-800/80 shadow-xl backdrop-blur-md group hover:border-sky-500/30 transition-all">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/20 transition-all" />
          <p className="text-xs font-mono font-medium tracking-wider text-slate-400 uppercase">Top Category</p>
          <div className="mt-3">
            <span className="text-xl font-bold bg-linear-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
              Feature Request
            </span>
          </div>
        </div>

        {/* Response Rate */}
        <div className="relative overflow-hidden p-5 rounded-2xl bg-linear-to-b from-slate-900/80 to-slate-900/30 border border-slate-800/80 shadow-xl backdrop-blur-md group hover:border-amber-500/30 transition-all">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
          <p className="text-xs font-mono font-medium tracking-wider text-slate-400 uppercase">Response Rate</p>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-amber-400 tracking-tight">7%</span>
            <span className="text-xs text-slate-500 font-mono">SLA Active</span>
          </div>
        </div>
      </section>

      {/* ---------------- GROUNDED AI SEARCH (RAG SECTION) ---------------- */}
      <section className="p-5 rounded-2xl bg-linear-to-r from-indigo-950/30 via-slate-900/50 to-slate-900/30 border border-indigo-500/20 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <h2 className="text-sm font-semibold tracking-wide text-slate-200 uppercase font-mono">
              Ask Loop (Grounded AI Search)
            </h2>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            Day 15 AI RAG Engine
          </span>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type query e.g., 'login issue', 'bug report', or 'billing timeout'..."
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/60 transition-all"
            />
          </div>
          <button className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 fill-current" />
            Ask AI
          </button>
        </div>
      </section>

      {/* ---------------- INGESTION CONTROLS (CSV & SIMULATOR) ---------------- */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bulk Data Import */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl space-y-3">
          <h3 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Upload className="w-4 h-4 text-sky-400" />
            Bulk CSV Data Import
          </h3>
          <div className="flex items-center gap-3">
            <label className="cursor-pointer text-xs font-semibold px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all">
              Choose File
              <input type="file" className="hidden" accept=".csv" />
            </label>
            <span className="text-xs text-slate-500 font-mono">No file chosen</span>
          </div>
        </div>

        {/* Webhook Simulator */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              Live Webhook Simulator
            </h3>
            <p className="text-xs text-slate-500">Inject simulated integration ticket directly into DB</p>
          </div>
          <button className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            Seed Ticket
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
              3 records shown
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select className="bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-slate-700">
              <option>All Channels</option>
            </select>
            <select className="bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-slate-700">
              <option>All Sentiments</option>
            </select>
            <select className="bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-slate-700">
              <option>All Themes</option>
            </select>
            <div className="relative">
              <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search content..." 
                className="bg-slate-950/80 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-slate-700" 
              />
            </div>
          </div>
        </div>

        {/* Inbox Items */}
        <div className="space-y-3">
          
          {/* Record 1 */}
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between gap-4 group">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <p className="text-xs font-medium text-slate-200">
                  [Slack Sync] Webhook payload latency spike observed during peak load hours.
                </p>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
                <span>Source: <strong className="text-slate-400">WEBHOOK</strong></span>
                <span>• Rating: <strong className="text-amber-400">3/5</strong></span>
                <span>• Sentiment: <strong className="text-slate-300">NEUTRAL</strong></span>
                <span>• Intent: <strong className="text-sky-400">System Alert</strong></span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-semibold px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              NEW
            </span>
          </div>

          {/* Record 2 */}
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between gap-4 group">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-red-400" />
                <p className="text-xs font-medium text-slate-200">
                  [Intercom] Users reporting billing portal timeout when exporting annual receipts.
                </p>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
                <span>Source: <strong className="text-slate-400">WEB</strong></span>
                <span>• Rating: <strong className="text-red-400">2/5</strong></span>
                <span>• Sentiment: <strong className="text-red-400">NEGATIVE</strong></span>
                <span>• Intent: <strong className="text-amber-400">Bug Report</strong></span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-semibold px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              NEW
            </span>
          </div>

          {/* Record 3 */}
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between gap-4 group">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <p className="text-xs font-medium text-slate-200">
                  [In-App Prompt] Love the high-contrast dark mode dashboard charts!
                </p>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
                <span>Source: <strong className="text-slate-400">IN_APP</strong></span>
                <span>• Rating: <strong className="text-emerald-400">5/5</strong></span>
                <span>• Sentiment: <strong className="text-emerald-400">POSITIVE</strong></span>
                <span>• Intent: <strong className="text-emerald-400">Praise</strong></span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-semibold px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              VERIFIED
            </span>
          </div>

        </div>
      </section>

    </div>
  );
}