'use client';

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

function Documents() {
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

      {/* Circuit pattern overlay - EXACT from dashboard */}
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
            UPLOAD DOCUMENTS
          </h1>

          {/* Empty content area with blur effect container */}
          <div style={{
            marginTop: '32px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            width: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden',
            minHeight: '400px'
          }}>
            {/* Content will be added here later */}
          </div>
        </div>
      </div>
    </>
  );
}

export default withPageAuthRequired(Documents);