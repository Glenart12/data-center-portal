'use client';

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from 'react';

function Dashboard() {
  const [currentWeek, setCurrentWeek] = useState(0);

  useEffect(() => {
    // Calculate weeks from September 1, 2025
    const startDate = new Date('2025-09-01');
    const today = new Date();
    const diffTime = Math.abs(today - startDate);
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    setCurrentWeek(diffWeeks);
  }, []);

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
        {/* Element Critical Logo */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '40px'
        }}>
          <img
            src="/T5-Logo-RGB-Dev-Horiz-Color.png"
            alt="T5 Data Centers"
            style={{
              height: '80px',
              width: 'auto',
              objectFit: 'contain'
            }}
          />
        </div>

        <h1 style={{
          color: '#0A1628',
          fontSize: '2.25rem',
          textAlign: 'center',
          marginBottom: '40px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}>
          WELCOME TO THE OPERATIONS PORTAL
        </h1>

        {/* Image Card - Navy Background, No Header */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          width: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}>
          {/* Image Content with Navy Background */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#0A1628'
          }}>
            <img
              src="/YLO_DC.jpg"
              alt="Data Center Operations"
              style={{
                width: '100%',
                maxHeight: '400px',
                height: 'auto',
                objectFit: 'cover'
              }}
            />
          </div>
        </div>

        {/* Client Information Card */}
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
            CLIENT INFORMATION
          </div>

          {/* Client Information Content */}
          <div style={{
            padding: '32px',
            backgroundColor: 'white'
          }}>
            <div style={{
              display: 'grid',
              gap: '20px',
              fontSize: '16px',
              color: '#374151',
              fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ fontWeight: 'bold', minWidth: '150px', color: '#0A1628' }}>Client Name:</span>
                <span>T5 Data Centers</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ fontWeight: 'bold', minWidth: '150px', color: '#0A1628' }}>Site Name:</span>
                <span>Austin One</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ fontWeight: 'bold', minWidth: '150px', color: '#0A1628' }}>Site Address:</span>
                <span>8025 North Interstate Hwy 35, Austin, TX 78753</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ fontWeight: 'bold', minWidth: '150px', color: '#0A1628' }}>Start Date:</span>
                <span>September 1, 2025</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ fontWeight: 'bold', minWidth: '150px', color: '#0A1628' }}>Current Period:</span>
                <span>Week {currentWeek} of 2025</span>
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