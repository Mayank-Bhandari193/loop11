export default function Loading() {
  return (
    <div className="p-6 space-y-6 animate-pulse max-w-7xl mx-auto">
      {/* Top Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-slate-800/50 rounded-xl border border-slate-700/50" />
        ))}
      </div>
      {/* Chart & AI Summary Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="h-64 bg-slate-800/50 rounded-xl border border-slate-700/50 lg:col-span-2" />
        <div className="h-64 bg-slate-800/50 rounded-xl border border-slate-700/50" />
      </div>
      {/* Table/Inbox Skeleton */}
      <div className="h-96 bg-slate-800/50 rounded-xl border border-slate-700/50" />
    </div>
  );
}