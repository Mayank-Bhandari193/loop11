import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0B0F19]">
      <div className="text-center max-w-md space-y-4">
        <h1 className="text-6xl font-extrabold text-indigo-500">404</h1>
        <h2 className="text-2xl font-bold text-white">Page Not Found</h2>
        <p className="text-slate-400 text-sm">
          The requested report or analytics path does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}