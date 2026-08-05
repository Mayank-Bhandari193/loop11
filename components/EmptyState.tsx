interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
}

export function EmptyState({
  title = "No feedback records found",
  description = "Try adjusting your filters or date ranges to view data.",
  onReset,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-700/60 rounded-xl bg-slate-900/30">
      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4 text-slate-400">
        🔍
      </div>
      <h3 className="text-base font-semibold text-slate-200">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mt-1 mb-4">{description}</p>
      {onReset && (
        <button
          onClick={onReset}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-md border border-slate-600 transition-colors"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}