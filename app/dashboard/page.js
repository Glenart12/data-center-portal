'use client';

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from 'react';

function Dashboard() {
  const [fileCounts, setFileCounts] = useState({
    mops: 0,
    sops: 0,
    eops: 0
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [mopsRes, sopsRes, eopsRes] = await Promise.all([
          fetch('/api/files/mops'),
          fetch('/api/files/sops'),
          fetch('/api/files/eops')
        ]);

        const [mopsData, sopsData, eopsData] = await Promise.all([
          mopsRes.json(),
          sopsRes.json(),
          eopsRes.json()
        ]);

        setFileCounts({
          mops: mopsData.files?.length || 0,
          sops: sopsData.files?.length || 0,
          eops: eopsData.files?.length || 0
        });
      } catch (error) {
        console.log('Error fetching file counts:', error);
      }
    };

    fetchCounts();
  }, []);

  const cardData = [
    {
      href: '/mop',
      title: 'MOPs',
      subtitle: 'Methods of Procedure',
      color: '#0A1628',
      count: fileCounts.mops,
      icon: '📄'
    },
    {
      href: '/sop',
      title: 'SOPs',
      subtitle: 'Standard Operating Procedures',
      color: '#1E3A5F',
      count: fileCounts.sops,
      icon: '📋'
    },
    {
      href: '/eop',
      title: 'EOPs',
      subtitle: 'Emergency Operating Procedures',
      color: '#DC2626',
      count: fileCounts.eops,
      icon: '🚨'
    }
  ];

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
          Welcome to the Operations Portal
        </h1>
      </div>
    </div>
    </>
  );
}

export default withPageAuthRequired(Dashboard);