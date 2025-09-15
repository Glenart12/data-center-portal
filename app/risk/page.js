'use client';

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

function RiskPage() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0A1628',
      paddingTop: '100px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Grid background - copy exact pattern from dashboard */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        pointerEvents: 'none'
      }} />

      {/* Main container with blur */}
      <div style={{
        position: 'relative',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '48px 24px'
      }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#ffffff',
          textAlign: 'center',
          marginBottom: '32px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}>
          Delay and Risk Management
        </h1>

        {/* Content area - empty for now */}
      </div>
    </div>
  );
}

export default withPageAuthRequired(RiskPage);