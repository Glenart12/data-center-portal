'use client';

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

function RiskPage() {
  return (
    <>
      {/* Background gradient */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to bottom, #FFFFFF, #F9FAFB)',
        zIndex: -2
      }} />

      {/* Circuit pattern overlay - EXACT from frontend */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.02,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10h10v10h10v-10h10v10h10v10h10v10h-10v10h10v10h10v10h-10v10h-10v-10h-10v10h-10v-10h-10v-10h-10v-10h10v-10h-10v-10h-10v-10h10v-10zm20 20h10v10h-10v-10zm20 0h10v10h-10v-10zm0 20h10v10h-10v-10zm-20 0h10v10h-10v-10z' fill='%23001f3f' fill-opacity='1'/%3E%3C/svg%3E")`,
        backgroundSize: '100px 100px',
        zIndex: -1,
        pointerEvents: 'none'
      }} />

      {/* Main Content */}
      <div style={{
        padding: '32px',
        paddingTop: '100px',
        fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif',
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h1 style={{
            color: '#0A1628',
            fontSize: '2.25rem',
            textAlign: 'center',
            marginBottom: '32px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}>
            DELAY AND RISK MANAGEMENT
          </h1>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            marginTop: '32px'
          }}>
            {/* Blue header banner */}
            <div style={{
              backgroundColor: '#0070f3',
              color: 'white',
              padding: '16px 24px',
              fontSize: '18px',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              RISK DASHBOARD
            </div>

            {/* Empty card body */}
            <div style={{
              padding: '24px',
              minHeight: '200px'
            }}>
              {/* Content will be added here later */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default withPageAuthRequired(RiskPage);