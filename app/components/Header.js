'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { user, isLoading } = useUser();
  const pathname = usePathname();

  if (isLoading) return null;

  // Don't show header if user is not logged in
  if (!user) return null;

  // Helper function to check if current page is active
  const isActivePage = (href) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname === href;
  };

  return (
    <header style={{
      background: 'linear-gradient(135deg, #0f3456 0%, #1e4a72 100%)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '16px 24px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 8px 32px rgba(15, 52, 86, 0.3)',
      transition: 'all 0.3s ease',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: 'Century Gothic, CenturyGothic, AppleGothic, sans-serif'
      }}>
        {/* Left side - Logo and Company Name */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '20px',
          flex: '0 0 auto',
          marginRight: '30px'
        }}>
          {/* Logo - Display directly without container */}
          <img 
            src="/Cream_Logo.svg" 
            alt="Glenart Group Logo" 
            style={{ 
              height: '70px',
              width: '70px',
              objectFit: 'contain'
            }}
            onError={(e) => {
              // If logo doesn't exist, show initials
              e.target.style.display = 'none';
              const fallback = document.createElement('span');
              fallback.style.color = '#ffffff';
              fallback.style.fontWeight = 'bold';
              fallback.style.fontSize = '28px';
              fallback.textContent = 'GG';
              e.target.parentNode.replaceChild(fallback, e.target);
            }}
          />
          
          {/* Divider Line */}
          <div style={{
            width: '1px',
            height: '40px',
            background: 'linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.5), transparent)',
            margin: '0 4px'
          }}></div>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '2px'
          }}>
            <h1 style={{ 
              margin: 0, 
              fontSize: 'clamp(14px, 2vw, 24px)',
              fontWeight: '600',
              fontFamily: 'Century Gothic, CenturyGothic, AppleGothic, sans-serif',
              color: 'white',
              letterSpacing: '1px',
              textShadow: '0 2px 6px rgba(0,0,0,0.3)',
              lineHeight: '1.1',
              textTransform: 'uppercase'
            }}>
              <div>Automated Procedure</div>
              <div>Generator</div>
            </h1>
            <div style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.8)',
              letterSpacing: '0.5px',
              fontWeight: '400',
              lineHeight: '1.2'
            }}>
              <div>Data Center Operations</div>
              <div>Portal</div>
            </div>
          </div>
        </div>

        {/* Center - Navigation */}
        <nav style={{ 
          display: 'flex', 
          gap: '12px',
          alignItems: 'center',
          marginLeft: '20px',
          marginRight: '20px'
        }}>
          {[
            { href: '/', label: 'Home' },
            { href: '/mop', label: 'MOPs' },
            { href: '/sop', label: 'SOPs' },
            { href: '/eop', label: 'EOPs' }
          ].map(({ href, label }) => (
            <a 
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 24px',
                backgroundColor: isActivePage(href) ? 'white' : 'rgba(255, 255, 255, 0.9)',
                color: isActivePage(href) ? '#0f3456' : '#2c3e50',
                textDecoration: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: isActivePage(href) ? '700' : '600',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                minWidth: '90px',
                boxShadow: isActivePage(href) 
                  ? '0 4px 16px rgba(255, 255, 255, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)' 
                  : '0 2px 8px rgba(0, 0, 0, 0.1)',
                border: isActivePage(href) ? '2px solid #0070f3' : '2px solid transparent',
                transform: isActivePage(href) ? 'translateY(-1px)' : 'translateY(0)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (!isActivePage(href)) {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = '#0f3456';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 255, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15)';
                  e.currentTarget.style.border = '2px solid rgba(0, 112, 243, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActivePage(href)) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                  e.currentTarget.style.color = '#2c3e50';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.border = '2px solid transparent';
                }
              }}
            >
              {label}
              {isActivePage(href) && (
                <div style={{
                  position: 'absolute',
                  bottom: '4px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '24px',
                  height: '3px',
                  background: 'linear-gradient(90deg, #00d4ff, #0070f3)',
                  borderRadius: '2px'
                }} />
              )}
            </a>
          ))}
        </nav>

        {/* Right side - User info and Logout */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px',
          flex: '0 0 auto'
        }}>
          {/* User Avatar & Info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 12px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00d4ff 0%, #0070f3 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold',
              boxShadow: '0 2px 8px rgba(0, 112, 243, 0.3)'
            }}>
              {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div style={{ 
                color: 'white', 
                fontSize: '14px',
                fontWeight: '500',
                lineHeight: '1.2'
              }}>
                {user.name || user.email?.split('@')[0] || 'User'}
              </div>
              <div style={{ 
                color: 'rgba(255, 255, 255, 0.7)', 
                fontSize: '12px',
                lineHeight: '1.2'
              }}>
                {user.email}
              </div>
            </div>
          </div>
          
          {/* Logout Button */}
          <a 
            href="/api/auth/logout"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              background: 'linear-gradient(135deg, #dc3545 0%, #ff3742 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 2px 8px rgba(220, 53, 69, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #ff3742 0%, #ff2730 100%)';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #dc3545 0%, #ff3742 100%)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(220, 53, 69, 0.3)';
            }}
          >
            🚪 Logout
          </a>
        </div>
      </div>

      {/* Add responsive styles */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        /* Tablet responsive design */
        @media (max-width: 1024px) {
          nav a {
            min-width: 70px !important;
            padding: 10px 18px !important;
            font-size: 14px !important;
          }
          
          header > div > div:first-child h1 {
            font-size: clamp(12px, 1.8vw, 20px) !important;
          }
        }
        
        /* Mobile responsive design */
        @media (max-width: 768px) {
          header {
            padding: 12px 16px !important;
          }
          
          header > div {
            flex-direction: column !important;
            gap: 12px !important;
          }
          
          header > div > div:first-child {
            width: 100% !important;
            justify-content: center !important;
            gap: 12px !important;
            margin-right: 0 !important;
          }
          
          header > div > div:first-child img {
            height: 50px !important;
            width: 50px !important;
          }
          
          header > div > div:first-child > div:nth-child(2) {
            display: none !important;
          }
          
          header > div > div:first-child > div:last-child {
            align-items: center !important;
          }
          
          header > div > div:first-child h1 {
            font-size: clamp(10px, 3.5vw, 16px) !important;
            text-align: center !important;
            letter-spacing: 0.5px !important;
          }
          
          header > div > div:first-child h1 > div {
            line-height: 1.1 !important;
          }
          
          header > div > div:first-child > div:last-child > div:last-child {
            display: none !important;
          }
          
          nav {
            width: 100% !important;
            justify-content: center !important;
            flex-wrap: wrap !important;
            gap: 8px !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
          
          nav a {
            min-width: 60px !important;
            padding: 8px 12px !important;
            font-size: 13px !important;
          }
          
          header > div > div:last-child {
            width: 100% !important;
            justify-content: center !important;
          }
          
          header > div > div:last-child > div:first-child {
            display: none !important;
          }
        }
        
        /* Small mobile responsive design */
        @media (max-width: 480px) {
          header {
            padding: 10px 12px !important;
          }
          
          header > div > div:first-child {
            gap: 8px !important;
          }
          
          header > div > div:first-child img {
            height: 45px !important;
            width: 45px !important;
          }
          
          header > div > div:first-child h1 {
            font-size: clamp(9px, 3vw, 14px) !important;
            letter-spacing: 0.3px !important;
          }
          
          header > div > div:first-child h1 > div {
            line-height: 1.1 !important;
          }
          
          nav a {
            min-width: 50px !important;
            padding: 6px 10px !important;
            font-size: 12px !important;
          }
        }
      `}</style>
    </header>
  );
}