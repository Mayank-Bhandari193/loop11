"use client";

import { useState } from "react";

interface FeatureOption {
  id: string;
  title: string;
  votes: number;
}

export default function InteractiveFeedbackWidget() {
  const [selectedSentiment, setSelectedSentiment] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [feedbackContent, setFeedbackContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Upvote Roadmap State
  const [features, setFeatures] = useState<FeatureOption[]>([
    { id: "feat_1", title: "🌙 High-Contrast Dark Mode & Tag Filters", votes: 48 },
    { id: "feat_2", title: "🔐 Google SSO & Multi-Tenant Access", votes: 36 },
    { id: "feat_3", title: "⚡ Grounded AI Natural Language Search", votes: 41 },
  ]);
  const [votedId, setVotedId] = useState<string | null>(null);

  const availableTags = ["#UI/UX", "#Speed", "#BugReport", "#FeatureRequest", "#Billing"];

  const sentiments = [
    { label: "Needs Improvement", emoji: "😟", value: "NEGATIVE", color: "hover:border-rose-500 hover:bg-rose-950/20" },
    { label: "It's Okay", emoji: "😐", value: "NEUTRAL", color: "hover:border-amber-500 hover:bg-amber-950/20" },
    { label: "Loved It!", emoji: "🤩", value: "VERY_POSITIVE", color: "hover:border-emerald-500 hover:bg-emerald-950/20" },
  ];

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleVote = (id: string) => {
    if (votedId === id) return;
    setFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, votes: f.votes + 1 } : f))
    );
    setVotedId(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSentiment) return;

    setIsSubmitting(true);

    const fullMessage = `${selectedTags.join(" ")} ${feedbackContent}`.trim();

    try {
      await fetch("/api/seed-attraction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: fullMessage || "User submitted interactive feedback.",
          sentiment: selectedSentiment,
        }),
      }).catch((err) => console.log("API Sync Notice:", err));
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSelectedSentiment(null);
    setSelectedTags([]);
    setFeedbackContent("");
  };

  return (
    <div className="max-w-xl mx-auto p-6 md:p-8 bg-linear-to-b from-[#0D1322] to-[#07090E] border border-slate-800 rounded-3xl shadow-2xl text-slate-100 space-y-8">
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              Co-Create With Us
            </span>
            <h2 className="text-2xl font-extrabold text-white pt-2">How was your experience?</h2>
            <p className="text-xs text-slate-400">Your feedback routes directly to our live engineering roadmap.</p>
          </div>

          {/* 1. Emoji Sentiment Selector */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              1. Select Satisfaction Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {sentiments.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSelectedSentiment(s.value)}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col items-center gap-1.5 active:scale-95 ${
                    selectedSentiment === s.value
                      ? "border-indigo-500 bg-indigo-600/20 shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500"
                      : `border-slate-800/90 bg-slate-950/60 ${s.color}`
                  }`}
                >
                  <span className="text-3xl">{s.emoji}</span>
                  <span className="text-[11px] font-medium text-slate-300">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Interactive Tag Chips */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              2. Quick Topic Tags (Optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all active:scale-95 ${
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30"
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Detailed Feedback Input */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              3. Share Details or Request Feature
            </label>
            <textarea
              value={feedbackContent}
              onChange={(e) => setFeedbackContent(e.target.value)}
              placeholder="Tell us what you liked or what feature you want us to build next..."
              rows={3}
              className="w-full bg-slate-950 border border-slate-800/90 text-xs text-slate-200 rounded-2xl p-4 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedSentiment || isSubmitting}
            className="w-full py-3.5 bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 text-white font-bold text-xs rounded-2xl shadow-xl shadow-indigo-600/25 transition-all active:scale-95"
          >
            {isSubmitting ? "Routing to Loop11 Engine..." : "🚀 Submit Instant Feedback"}
          </button>
        </form>
      ) : (
        /* Dynamic Thank You Card */
        <div className="text-center py-6 space-y-4 animate-fadeIn">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-3xl">
            🎉
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-white">Feedback Injected!</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Aapka response humare live **Loop11 Feedback Engine** mein sync ho gaya hai.
            </p>
          </div>

          <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl text-xs text-indigo-200 text-left space-y-1">
            <strong className="text-indigo-300">🤖 Real-Time Action:</strong>
            <p className="text-slate-300">
              Selected sentiment: <span className="text-emerald-400 font-semibold">{selectedSentiment}</span>. Product team is automatically notified!
            </p>
          </div>

          <button
            onClick={handleReset}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 underline pt-2"
          >
            Submit Another Feedback
          </button>
        </div>
      )}

      <hr className="border-slate-800/80" />

      {/* Feature Roadmap & Voting Section */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            🗳️ Live Public Feature Roadmap
          </h3>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-semibold">
            You Vote, We Build
          </span>
        </div>

        <div className="space-y-2.5">
          {features.map((feat) => {
            const hasVoted = votedId === feat.id;
            return (
              <div
                key={feat.id}
                className="p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-2xl flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
              >
                <p className="text-xs font-medium text-slate-200">{feat.title}</p>
                <button
                  type="button"
                  onClick={() => handleVote(feat.id)}
                  disabled={hasVoted}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all active:scale-95 flex items-center gap-1.5 ${
                    hasVoted
                      ? "bg-emerald-600 text-white border-emerald-500"
                      : "bg-slate-900 text-slate-300 border-slate-800 hover:border-indigo-500 hover:text-indigo-300"
                  }`}
                >
                  <span>{hasVoted ? "✓ Voted" : "▲ Vote"}</span>
                  <span className="px-1.5 py-0.5 bg-slate-800/80 rounded-md text-[10px]">
                    {feat.votes}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}