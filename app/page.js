export default function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>TEST PAGE</h1>
      <p>If you can see this, the site works without Auth0!</p>
      <p>Current time: {new Date().toLocaleString()}</p>
    </div>
  );
}