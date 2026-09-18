'use client';

export default function Error() {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-700">
          500
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">
          Something went wrong
        </h1>
        <p className="mt-3 text-slate-500">
          Please refresh the page and try again.
        </p>
      </div>
    </main>
  );
}
