/* eslint-disable @next/next/no-html-link-for-pages */

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16 text-center">
      <div className="max-w-md">
        <p className="text-sm font-semibold uppercase tracking-widest text-mainBlue/70">
          404
        </p>
        <h1 className="mt-3 text-3xl font-bold text-mainBlue">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          The page you are looking for does not exist.
        </p>
        <a
          href="/en/dashboard"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-mainBlue px-4 text-sm font-semibold text-white transition hover:bg-mainBlue/90"
        >
          Go to dashboard
        </a>
      </div>
    </main>
  );
}
