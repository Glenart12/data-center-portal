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
    // Fetch file counts for each category
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
      color: '#0f3456',
      count: fileCounts.mops,
      icon: '📄'
    },
    { 
      href: '/sop', 
      title: 'SOPs', 
      subtitle: 'Standard Operating Procedures', 
      color: '#1e5f8b',
      count: fileCounts.sops,
      icon: '📋'
    },
    { 
      href: '/eop', 
      title: 'EOPs', 
      subtitle: 'Emergency Operating Procedures', 
      color: '#dc3545',
      count: fileCounts.eops,
      icon: '🚨'
    }
  ];

  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif' 
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{
          color: '#0f3456',
          fontSize: '2.5em',
          textAlign: 'center',
          marginBottom: '40px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}>
          Welcome to the Operations Portal
        </h1>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '30px', 
          marginTop: '40px' 
        }}>
          {cardData.map(({ href, title, subtitle, color, count, icon }) => (
            <a key={href} href={href} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                padding: '40px 30px',
                borderRadius: '15px',
                border: '1px solid rgba(0,0,0,0.1)',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                position: 'relative',
                minHeight: '220px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
                e.currentTarget.style.borderColor = color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)';
              }}
              >
                {/* Document Count Badge */}
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  backgroundColor: color,
                  color: 'white',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                }}>
                  {count} {count === 1 ? 'Document' : 'Documents'}
                </div>

                {/* Icon */}
                <div style={{
                  fontSize: '3em',
                  marginBottom: '20px',
                  opacity: 0.8
                }}>
                  {icon}
                </div>

                {/* Title */}
                <h2 style={{ 
                  color: color, 
                  marginBottom: '15px',
                  fontSize: '2.2em',
                  fontWeight: 'bold'
                }}>
                  {title}
                </h2>

                {/* Subtitle */}
                <p style={{ 
                  color: '#666',
                  fontSize: '1.1em',
                  margin: 0,
                  lineHeight: '1.4',
                  marginBottom: '15px'
                }}>
                  {subtitle}
                </p>

                {/* Status */}
                <div style={{
                  marginTop: '15px',
                  padding: '8px 16px',
                  backgroundColor: count > 0 ? 'rgba(40, 167, 69, 0.1)' : 'rgba(108, 117, 125, 0.1)',
                  borderRadius: '20px',
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
          marginTop: '50px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '15px',
          padding: '30px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{
            color: '#0f3456',
            marginBottom: '20px',
            fontSize: '1.5em'
          }}>
            Document Library Summary
          </h3>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '15px 25px',
              backgroundColor: 'rgba(15, 52, 86, 0.1)',
              borderRadius: '10px'
            }}>
              <span style={{ fontSize: '1.5em' }}>📚</span>
              <div>
                <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#0f3456' }}>
                  {fileCounts.mops + fileCounts.sops + fileCounts.eops}
                </div>
                <div style={{ fontSize: '0.9em', color: '#666' }}>Total Documents</div>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '15px 25px',
              backgroundColor: 'rgba(40, 167, 69, 0.1)',
              borderRadius: '10px'
            }}>
              <span style={{ fontSize: '1.5em' }}>✅</span>
              <div>
                <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#28a745' }}>
                  {[fileCounts.mops, fileCounts.sops, fileCounts.eops].filter(count => count > 0).length}
                </div>
                <div style={{ fontSize: '0.9em', color: '#666' }}>Active Categories</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withPageAuthRequired(Dashboard);