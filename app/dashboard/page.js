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
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginTop: '32px'
        }}>
          {cardData.map(({ href, title, subtitle, color, count, icon }) => (
            <a key={href} href={href} style={{ textDecoration: 'none' }}>
              <div style={{
                backgroundColor: '#FFFFFF',
                padding: '32px 24px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                position: 'relative',
                minHeight: '220px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  backgroundColor: color,
                  color: 'white',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                }}>
                  {count} {count === 1 ? 'Document' : 'Documents'}
                </div>

                <div style={{
                  fontSize: '3em',
                  marginBottom: '16px',
                  opacity: 0.8
                }}>
                  {icon}
                </div>

                <h2 style={{
                  color: color,
                  marginBottom: '16px',
                  fontSize: '1.875rem',
                  fontWeight: '600'
                }}>
                  {title}
                </h2>

                <p style={{
                  color: '#4A5568',
                  fontSize: '1rem',
                  margin: 0,
                  lineHeight: '1.5',
                  marginBottom: '16px'
                }}>
                  {subtitle}
                </p>

                <div style={{
                  marginTop: '16px',
                  padding: '8px 16px',
                  backgroundColor: count > 0 ? 'rgba(40, 167, 69, 0.1)' : 'rgba(108, 117, 125, 0.1)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: count > 0 ? '#28a745' : '#6c757d',
                  fontWeight: '600'
                }}>
                  {count > 0 ? '✓ Available' : '○ No documents yet'}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Summary Stats */}
        <div style={{
          marginTop: '32px',
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{
            color: '#0A1628',
            marginBottom: '16px',
            fontSize: '1.25rem'
          }}>
            Document Library Summary
          </h3>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '32px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 24px',
              backgroundColor: 'rgba(10, 22, 40, 0.1)',
              borderRadius: '6px'
            }}>
              <span style={{ fontSize: '1.5em' }}>📚</span>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#0A1628' }}>
                  {fileCounts.mops + fileCounts.sops + fileCounts.eops}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#4A5568' }}>Total Documents</div>
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 24px',
              backgroundColor: 'rgba(40, 167, 69, 0.1)',
              borderRadius: '6px'
            }}>
              <span style={{ fontSize: '1.5em' }}>✅</span>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#28a745' }}>
                  {[fileCounts.mops, fileCounts.sops, fileCounts.eops].filter(count => count > 0).length}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#4A5568' }}>Active Categories</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default withPageAuthRequired(Dashboard);