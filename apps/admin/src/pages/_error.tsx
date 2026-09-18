import type { NextPageContext } from 'next';

type ErrorPageProps = {
  statusCode?: number;
};

export default function ErrorPage({ statusCode = 500 }: ErrorPageProps) {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, color: '#b91c1c' }}>{statusCode}</p>
        <h1 style={{ marginTop: 12, fontSize: 32, color: '#0f172a' }}>Something went wrong</h1>
        <p style={{ marginTop: 12, color: '#64748b' }}>Please refresh the page and try again.</p>
      </div>
    </main>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => ({
  statusCode: res?.statusCode ?? err?.statusCode ?? 500,
});
