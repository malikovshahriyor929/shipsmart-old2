export default function Custom404() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, color: '#173766' }}>404</p>
        <h1 style={{ marginTop: 12, fontSize: 32, color: '#173766' }}>Page not found</h1>
        <p style={{ marginTop: 12, color: '#64748b' }}>The page you are looking for does not exist.</p>
      </div>
    </main>
  );
}
