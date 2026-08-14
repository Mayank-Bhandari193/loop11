"use client";

import { useState } from "react";

interface SmartFeedbackModalProps {
  feedback: {
    id: string;
    content: string;
    channel: string;
    sentiment: string;
    rating?: string;
  } | null;
  onClose: () => void;
}

export default function SmartFeedbackModal({ feedback, onClose }: SmartFeedbackModalProps) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<{
    churnRisk: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    urgencyScore: number;
    rootCause: string;
    suggestedReply: string;
    suggestedActionItem: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!feedback) return null;

  const handleGenerateSmartReply = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/feedback/smart-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedbackText: feedback.content,
          sentiment: feedback.sentiment,
          channel: feedback.channel,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAnalysis(data.analysis);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReply = () => {
    if (analysis?.suggestedReply) {
      navigator.clipboard.writeText(analysis.suggestedReply);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "CRITICAL":
        return "bg-rose-500/20 text-rose-400 border-rose-500/40";
      case "HIGH":
        return "bg-amber-500/20 text-amber-400 border-amber-500/40";
      case "MEDIUM":
        return "bg-indigo-500/20 text-indigo-400 border-indigo-500/40";
      default:
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/40";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0D1322] border border-slate-800 w-full max-w-2xl rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl text-slate-100 relative">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-800/80 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              ⚡ Loop11 AI Copilot
            </span>
            <h3 className="text-xl font-black text-white mt-2">Ticket Intelligence & Smart Action</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg px-2 py-1 rounded-lg hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Original Feedback Details */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Original Customer Feedback:</p>
          <p className="text-sm text-slate-200 leading-relaxed font-medium">"{feedback.content}"</p>
          <div className="flex gap-3 text-xs text-slate-400 pt-1">
            <span>Source: <strong className="text-indigo-400">{feedback.channel}</strong></span>
            <span>•</span>
            <span>Sentiment: <strong className="text-amber-400">{feedback.sentiment}</strong></span>
          </div>
        </div>

        {/* AI Action Trigger */}
        {!analysis ? (
          <div className="text-center py-4 space-y-3">
            <p className="text-xs text-slate-400">
              Let Groq LLM analyze churn risk factor, extract root cause, and generate an instant empathetic customer reply.
            </p>
            <button
              onClick={handleGenerateSmartReply}
              disabled={loading}
              className="px-6 py-3 bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Analyzing Context with AI..." : "🤖 Generate Smart Reply & Churn Analysis"}
            </button>
          </div>
        ) : (
          /* AI Generated Analysis Card */
          <div className="space-y-4 animate-fadeIn">
            {/* Top Badges */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3 rounded-xl border flex justify-between items-center ${getRiskColor(analysis.churnRisk)}`}>
                <span className="text-xs font-bold uppercase tracking-wider">Churn Risk Level</span>
                <span className="text-sm font-black">{analysis.churnRisk}</span>
              </div>
              <div className="p-3 rounded-xl border border-indigo-500/30 bg-indigo-950/30 flex justify-between items-center text-indigo-300">
                <span className="text-xs font-bold uppercase tracking-wider">Urgency Score</span>
                <span className="text-sm font-black">{analysis.urgencyScore} / 10</span>
              </div>
            </div>

            {/* Root Cause & Internal Action */}
            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">🛠️ Product Action Item:</span>
              <p className="text-xs text-slate-300">{analysis.suggestedActionItem}</p>
            </div>

            {/* Drafted Customer Reply */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  ✉️ Recommended Customer Response Draft:
                </span>
                <button
                  onClick={handleCopyReply}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20 active:scale-95 transition-all"
                >
                  {copied ? "✓ Copied!" : "📋 Copy Reply"}
                </button>
              </div>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-300 leading-relaxed font-mono">
                {analysis.suggestedReply}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}