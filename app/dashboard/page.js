'use client';

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from 'react';

// Half Circle Gauge Component
function HalfCircleGauge({ percentage }) {
  const radius = 50;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * Math.PI;

  // Calculate the length of the colored portion (from left to percentage point)
  const filledLength = (percentage / 100) * circumference;

  // Determine color based on percentage
  const color = percentage <= 33 ? '#EF4444' :
                percentage <= 66 ? '#F59E0B' : '#10B981';

  return (
    <div style={{ position: 'relative', width: '120px', height: '90px', margin: '0 auto' }}>
      <svg
        width="120"
        height="70"
        viewBox="0 0 120 70"
        style={{ overflow: 'visible' }}
      >
        {/* Background arc - full grey semi-circle */}
        <path
          d="M 10 60 A 50 50 0 0 1 110 60"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Colored arc - fills from left to right based on percentage */}
        <path
          d="M 10 60 A 50 50 0 0 1 110 60"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${filledLength} ${circumference}`}
          strokeDashoffset={0}
          style={{
            transition: 'stroke-dasharray 0.5s ease',
            transformOrigin: 'center',
          }}
        />
      </svg>
      {/* Percentage text - positioned below the arc */}
      <div style={{
        position: 'absolute',
        bottom: '25px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '16px',
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
          WELCOME TO THE OPERATIONS PORTAL
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
            PROGRESS DASHBOARD
          </div>
          
          {/* Card Content */}
          <div style={{
            padding: '32px'
          }}>
            {/* Percentage Complete Section */}
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0A1628', marginBottom: '24px', textAlign: 'center' }}>
              PERCENTAGE COMPLETE
            </h2>
          
          {/* Progress Bars */}
          <div style={{ marginBottom: '32px', maxWidth: '100%' }}>
            {[
              { type: 'MOP', complete: 83, current: 134, total: 162 },
              { type: 'SOP', complete: 39, current: 59, total: 151 },
              { type: 'EOP', complete: 31, current: 51, total: 164 }
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
                        backgroundColor: '#0A1628',
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
            CATEGORY BREAKDOWN
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '24px', width: '100%', overflow: 'hidden' }}>
            {[
              {
                category: 'MOP',
                gauges: [
                  { label: 'Mechanical', value: 100 },
                  { label: 'Electrical', value: 100 },
                  { label: 'White Space', value: 84 },
                  { label: 'Misc.', value: 49 }
                ]
              },
              {
                category: 'SOP',
                gauges: [
                  { label: 'Mechanical', value: 76 },
                  { label: 'Electrical', value: 58 },
                  { label: 'White Space', value: 18 },
                  { label: 'Misc.', value: 3 }
                ]
              },
              {
                category: 'EOP',
                gauges: [
                  { label: 'Mechanical', value: 57 },
                  { label: 'Electrical', value: 56 },
                  { label: 'White Space', value: 3 },
                  { label: 'Misc.', value: 6 }
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
                      <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '-10px' }}>
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