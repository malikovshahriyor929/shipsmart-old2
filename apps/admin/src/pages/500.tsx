export default function Custom500() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, color: '#b91c1c' }}>500</p>
        <h1 style={{ marginTop: 12, fontSize: 32, color: '#0f172a' }}>Server error</h1>
        <p style={{ marginTop: 12, color: '#64748b' }}>Please refresh the page and try again.</p>
      </div>
    </main>
  );
}
