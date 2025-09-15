'use client';

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from 'react';

// Half Circle Gauge Component
function HalfCircleGauge({ percentage }) {
  const radius = 50;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  // Determine color based on percentage
  const color = percentage <= 33 ? '#EF4444' : 
                percentage <= 66 ? '#F59E0B' : '#10B981';
  
  return (
    <div style={{ position: 'relative', width: '120px', height: '60px', margin: '0 auto' }}>
      <svg
        width="120"
        height="70"
        viewBox="0 0 120 70"
        style={{ transform: 'rotate(180deg)' }}
      >
        {/* Background arc */}
        <path
          d="M 10 60 A 50 50 0 0 1 110 60"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        {/* Filled arc */}
        <path
          d="M 10 60 A 50 50 0 0 1 110 60"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      {/* Percentage text */}
      <div style={{
        position: 'absolute',
        top: '35px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#0A1628'
      }}>
        {percentage}%
      </div>
    </div>
  );
}

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

        {/* Progress Dashboard Section */}
        <div style={{
          marginTop: '32px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          width: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}>
          {/* Navy Header Bar */}
          <div style={{
            backgroundColor: '#0A1628',
            padding: '16px 24px',
            color: '#FFFFFF',
            fontSize: '20px',
            fontWeight: 'bold',
            fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif'
          }}>
            Progress Dashboard
          </div>
          
          {/* Card Content */}
          <div style={{
            padding: '32px'
          }}>
            {/* Percentage Complete Section */}
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0A1628', marginBottom: '24px', textAlign: 'center' }}>
              Percentage Complete
            </h2>
          
          {/* Progress Bars */}
          <div style={{ marginBottom: '32px', maxWidth: '100%' }}>
            {[
              { type: 'MOP', complete: 85, current: 137, total: 162 },
              { type: 'SOP', complete: 58, current: 87, total: 151 },
              { type: 'EOP', complete: 25, current: 41, total: 164 }
            ].map(item => (
              <div key={item.type} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '60px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                    {item.type}
                  </div>
                  <div style={{ flex: 1, position: 'relative', maxWidth: '100%' }}>
                    <div style={{
                      height: '24px',
                      backgroundColor: '#E5E7EB',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${item.complete}%`,
                        background: item.complete <= 33 ? '#EF4444' : 
                                   item.complete <= 66 ? '#F59E0B' : '#10B981',
                        transition: 'width 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: '8px'
                      }}>
                        <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>
                          {item.complete}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', color: '#6B7280' }}>
                    {item.current}/{item.total} Documents
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Category Dials Section */}
          <h3 style={{ 
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#0A1628',
            marginBottom: '24px',
            marginTop: '48px',
            fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif',
            textAlign: 'center'
          }}>
            Category Breakdown
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '24px', width: '100%', overflow: 'hidden' }}>
            {[
              { 
                category: 'MOP',
                gauges: [
                  { label: 'Mechanical', value: 88 },
                  { label: 'Electrical', value: 85 },
                  { label: 'White Space', value: 84 },
                  { label: 'Misc.', value: 79 }
                ]
              },
              {
                category: 'SOP',
                gauges: [
                  { label: 'Mechanical', value: 60 },
                  { label: 'Electrical', value: 58 },
                  { label: 'White Space', value: 57 },
                  { label: 'Misc.', value: 56 }
                ]
              },
              {
                category: 'EOP',
                gauges: [
                  { label: 'Mechanical', value: 27 },
                  { label: 'Electrical', value: 24 },
                  { label: 'White Space', value: 23 },
                  { label: 'Misc.', value: 26 }
                ]
              }
            ].map(item => (
              <div key={item.category}>
                <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0A1628', marginBottom: '16px', textAlign: 'center' }}>
                  {item.category}
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px', width: '100%' }}>
                  {item.gauges.map(gauge => (
                    <div key={gauge.label} style={{ textAlign: 'center' }}>
                      <HalfCircleGauge percentage={gauge.value} />
                      <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                        {gauge.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default withPageAuthRequired(Dashboard);