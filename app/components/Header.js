'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { user, isLoading } = useUser();
  const pathname = usePathname();

  if (isLoading || !user) return null;

  return (
    <header style={{
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderBottom: '1px solid #eee',
      padding: '15px 20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Left side - Logo and Company Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img 
            src="/Cream_LogoWordMark-1 (1)-cropped.svg" 
            alt="Glenart Group Logo" 
            style={{ 
              height: '50px',
              width: 'auto'
            }}
            onError={(e) => {
              // Fallback if SVG doesn't load
              e.target.outerHTML = `<div style="width: 50px; height: 50px; background-color: #0f3456; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 18px;">GG</div>`;
            }}
          />
          <div>
            <h2 style={{ 
              margin: 0, 
              fontSize: '22px',
              color: '#0f3456',
              fontWeight: 'bold'
            }}>
              Glenart Group
            </h2>
            <p style={{ 
              margin: 0, 
              fontSize: '12px', 
              color: '#666',
              letterSpacing: '0.5px'
            }}>
              Site: CTP-003
            </p>
          </div>
        </div>

        {/* Center - Navigation */}
        <nav style={{ display: 'flex', gap: '5px' }}>
          {[
            { href: '/dashboard', label: 'Home' },
            { href: '/mop', label: 'MOPs' },
            { href: '/sop', label: 'SOPs' },
            { href: '/eop', label: 'EOPs' }
          ].map(({ href, label }) => (
            <a 
              key={href}
              href={href} 
              style={{ 
                padding: '10px 18px', 
                textDecoration: 'none',
                borderRadius: '6px',
                backgroundColor: pathname === href ? '#0f3456' : 'rgba(15, 52, 86, 0.1)',
                color: pathname === href ? 'white' : '#0f3456',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                border: pathname === href ? 'none' : '1px solid rgba(15, 52, 86, 0.2)'
              }}
              onMouseEnter={(e) => {
                if (pathname !== href) {
                  e.currentTarget.style.backgroundColor = 'rgba(15, 52, 86, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (pathname !== href) {
                  e.currentTarget.style.backgroundColor = 'rgba(15, 52, 86, 0.1)';
                }
              }}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Right side - User info and Logout */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '15px',
          fontSize: '14px'
        }}>
          <div style={{
            padding: '8px 12px',
            backgroundColor: 'rgba(15, 52, 86, 0.1)',
            borderRadius: '20px',
            color: '#0f3456'
          }}>
            {user.email}
          </div>
          <a 
            href="/api/auth/logout"
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'background-color 0.3s ease'
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