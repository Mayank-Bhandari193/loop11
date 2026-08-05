'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-8 max-w-md backdrop-blur-md">
        <h2 className="text-xl font-bold text-red-400 mb-2">Something went wrong!</h2>
        <p className="text-sm text-slate-300 mb-6">
          {error.message || "An unexpected system error occurred while loading this view."}
        </p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition-colors text-sm"
        >
          Try again
        </button>
      </div>
    </div>
  );
}