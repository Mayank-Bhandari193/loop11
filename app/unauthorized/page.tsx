import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0B0F19]">
      <div className="text-center max-w-md space-y-4">
        <div className="inline-flex p-3 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 mb-2">
          🔒
        </div>
        <h1 className="text-4xl font-bold text-white">403 - Forbidden</h1>
        <p className="text-slate-400 text-sm">
          Your role does not have administrative privileges to access this workspace configuration.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors"
        >
          Back to Main Workspace
        </Link>
      </div>
    </div>
  );
}