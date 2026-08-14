import SmartFeedbackModal from "@/components/SmartFeedbackModal";
import { useState } from "react";

interface FeedbackItem {
  id: string;
  content: string;
  channel: string;
  sentiment: string;
  status: string;
}

export default function DashboardPage() {
  const [selectedModalItem, setSelectedModalItem] = useState<FeedbackItem | null>(null);

  const filteredFeedbacks: FeedbackItem[] = [
    {
      id: "1",
      content: "The new onboarding flow feels much smoother than before.",
      channel: "Email",
      sentiment: "Positive",
      status: "Reviewed",
    },
    {
      id: "2",
      content: "The app is fast, but the billing page is confusing.",
      channel: "Chat",
      sentiment: "Neutral",
      status: "In Progress",
    },
    {
      id: "3",
      content: "Love the AI suggestions, but I would like more customization.",
      channel: "Survey",
      sentiment: "Positive",
      status: "Pending",
    },
  ];

  return (
    <div className="space-y-4">
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
              <span>Sentiment: <strong className="text-emerald-400">{item.sentiment}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2">
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

      <SmartFeedbackModal
        feedback={selectedModalItem}
        onClose={() => setSelectedModalItem(null)}
      />
    </div>
  );
}