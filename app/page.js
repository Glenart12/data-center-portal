import { useUser } from '@auth0/nextjs-auth0/client';

export default function Home() {
  const { user } = useUser();

  if (!user) {
    return (
      <main style={{ textAlign: 'center', marginTop: '100px' }}>
        <h1>Data Center Operations Portal</h1>
        <a href="/api/auth/login" style={{ 
          padding: '10px 20px', 
          background: 'blue', 
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: '5px' 
        }}>
          Login
        </a>
      </main>
    );
  }

  return (
    <main style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Welcome to Data Center Operations Portal</h1>
      <p>Hello, {user.name}!</p>
      <p>Use the navigation above to access MOPs, SOPs, and EOPs.</p>
    </main>
  );
}