import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function Home() {
  // Await cookies to ensure proper async handling in Next.js 15
  const cookieStore = await cookies();
  const session = await getSession(cookieStore);
  if (session) {
    redirect('/dashboard');
  }

  const mainStyles = {
    textAlign: 'center',
    marginTop: '100px',
    fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif',
    padding: '0 20px'
  };

  const containerStyles = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '20px',
    padding: '60px 40px',
    maxWidth: '600px',
    margin: '0 auto',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(10px)'
  };

  const titleStyles = {
    fontSize: '3em',
    marginBottom: '20px',
    color: '#0f3456',
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
  };

  const subtitleStyles = {
    fontSize: '1.3em',
    marginBottom: '40px',
    color: '#666',
    lineHeight: '1.6'
  };

  const linkStyles = {
    display: 'inline-block',
    padding: '18px 40px',
    background: 'linear-gradient(135deg, #0f3456 0%, #1e5f8b 100%)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '12px',
    fontSize: '18px',
    fontWeight: 'bold',
    boxShadow: '0 5px 20px rgba(15, 52, 86, 0.3)',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  };

  return (
    <main style={mainStyles}>
      <div style={containerStyles}>
        <h1 style={titleStyles}>Data Center Operations Portal</h1>
        <p style={subtitleStyles}>Secure access to operational procedures</p>
        <a href="/api/auth/login" style={linkStyles}>Login to Access Documents</a>
      </div>
    </main>
  );
}