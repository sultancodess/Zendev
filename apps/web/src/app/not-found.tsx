import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl font-bold bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent mb-4">
        404
      </h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-slate-400 max-w-md mb-8">
        The clinic management page or consultation resource you are looking for does not exist or has moved.
      </p>
      <Link
        href="/dashboard"
        className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold transition shadow-lg shadow-emerald-500/20"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
