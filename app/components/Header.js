'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { user, isLoading } = useUser();
  const pathname = usePathname();

  if (isLoading) return null;

  // Don't show header if user is not logged in
  if (!user) return null;

  return (
    <header style={{
      backgroundColor: '#fff',
      borderBottom: '1px solid #eee',
      padding: '15px 20px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: 'Century Gothic, CenturyGothic, AppleGothic, sans-serif'
      }}>
        {/* Left side - Logo and Company Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* Logo placeholder - replace src with your actual logo */}
          <img 
            src="/Cream_LogoWordMark-1 (1)-cropped.svg" 
            alt="Glenart Group Logo" 
            style={{ 
              height: '40px',
              width: 'auto'
            }}
            onError={(e) => {
              // If logo doesn't exist, show company name instead
              e.target.style.display = 'none';
            }}
          />
          <div>
            <h2 style={{ 
              margin: 0, 
              fontSize: '20px',
              color: '#333' 
            }}>
              Glenart Group
            </h2>
            <p style={{ 
              margin: 0, 
              fontSize: '12px',
              color: '#666' 
            }}>
              Site: CTP-003
            </p>
          </div>
        </div>

        {/* Center - Navigation */}
        <nav style={{ display: 'flex', gap: '10px' }}>
          <a 
            href="/"
            style={{
              padding: '8px 16px',
              backgroundColor: pathname === '/' ? '#0070f3' : 'transparent',
              color: pathname === '/' ? 'white' : '#333',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              border: pathname === '/' ? 'none' : '1px solid #ddd',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (pathname !== '/') {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
              }
            }}
            onMouseLeave={(e) => {
              if (pathname !== '/') {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            Home
          </a>
          
          <a 
            href="/mop"
            style={{
              padding: '8px 16px',
              backgroundColor: pathname === '/mop' ? '#0070f3' : 'transparent',
              color: pathname === '/mop' ? 'white' : '#333',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              border: pathname === '/mop' ? 'none' : '1px solid #ddd',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (pathname !== '/mop') {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
              }
            }}
            onMouseLeave={(e) => {
              if (pathname !== '/mop') {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            MOPs
          </a>
          
          <a 
            href="/sop"
            style={{
              padding: '8px 16px',
              backgroundColor: pathname === '/sop' ? '#0070f3' : 'transparent',
              color: pathname === '/sop' ? 'white' : '#333',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              border: pathname === '/sop' ? 'none' : '1px solid #ddd',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (pathname !== '/sop') {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
              }
            }}
            onMouseLeave={(e) => {
              if (pathname !== '/sop') {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            SOPs
          </a>
          
          <a 
            href="/eop"
            style={{
              padding: '8px 16px',
              backgroundColor: pathname === '/eop' ? '#0070f3' : 'transparent',
              color: pathname === '/eop' ? 'white' : '#333',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              border: pathname === '/eop' ? 'none' : '1px solid #ddd',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (pathname !== '/eop') {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
              }
            }}
            onMouseLeave={(e) => {
              if (pathname !== '/eop') {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            EOPs
          </a>
        </nav>

        {/* Right side - User info and Logout */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '20px',
          fontSize: '14px'
        }}>
          <span style={{ color: '#666' }}>{user.email}</span>
          <a 
            href="/api/auth/logout"
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#c82333';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#dc3545';
            }}
          >
            Logout
          </a>
        </div>
      </div>
    </header>
  );
}