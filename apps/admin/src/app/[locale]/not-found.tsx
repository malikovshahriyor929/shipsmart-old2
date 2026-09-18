/* eslint-disable @next/next/no-html-link-for-pages */

interface NotFoundProps {
  title?: string;
  description?: string | null;
  buttonLabel?: string;
  href?: string;
  btnShow?: boolean;
}

export default function NotFound({
  title = 'Page not found',
  description = 'The page you are looking for does not exist.',
  buttonLabel = 'Go to dashboard',
  href = '/dashboard',
  btnShow = true,
}: NotFoundProps) {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6 py-16 text-center">
      <div className="max-w-md">
        <p className="text-sm font-semibold uppercase tracking-widest text-mainBlue/70">
          404
        </p>
        <h1 className="mt-3 text-3xl font-bold text-mainBlue">{title}</h1>
        {description ? (
          <p className="mt-3 text-sm leading-6 text-gray-600">{description}</p>
        ) : null}
        {btnShow ? (
          <a
            href={href}
            className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-mainBlue px-4 text-sm font-semibold text-white transition hover:bg-mainBlue/90"
          >
            {buttonLabel}
          </a>
        ) : null}
      </div>
    </main>
  );
}
