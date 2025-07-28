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
      background: 'linear-gradient(135deg, rgba(15, 52, 86, 0.95) 0%, rgba(25, 62, 96, 0.95) 100%)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '16px 24px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 8px 32px rgba(15, 52, 86, 0.3)',
      transition: 'all 0.3s ease'
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
          gap: '16px',
          flex: '0 0 auto'
        }}>
          {/* Modern Logo Container */}
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #00d4ff 0%, #0070f3 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 112, 243, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Animated background effect */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
              animation: 'shimmer 3s infinite'
            }} />
            <img 
              src="/logo.png" 
              alt="Glenart Group Logo" 
              style={{ 
                width: '28px',
                height: '28px',
                objectFit: 'contain',
                position: 'relative',
                zIndex: 1
              }}
              onError={(e) => {
                // If logo doesn't exist, show initials
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = '<span style="color: white; font-weight: bold; font-size: 18px; z-index: 1; position: relative;">GG</span>';
              }}
            />
          </div>
          
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: '22px',
              fontWeight: '700',
              color: 'white',
              letterSpacing: '-0.5px',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              Glenart Group
            </h1>
            <p style={{ 
              margin: 0, 
              fontSize: '13px',
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: '500',
              letterSpacing: '0.5px'
            }}>
              Data Center Portal • CTP-003
            </p>
          </div>
        </div>

        {/* Center - Navigation */}
        <nav style={{ 
          display: 'flex', 
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '6px',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {[
            { href: '/', label: 'Home', icon: '🏠' },
            { href: '/mop', label: 'MOPs', icon: '📋' },
            { href: '/sop', label: 'SOPs', icon: '📖' },
            { href: '/eop', label: 'EOPs', icon: '🚨' }
          ].map(({ href, label, icon }) => (
            <a 
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                backgroundColor: pathname === href ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                color: pathname === href ? 'white' : 'rgba(255, 255, 255, 0.9)',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: pathname === href ? '600' : '500',
                border: pathname === href ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                minWidth: '80px',
                justifyContent: 'center',
                backdropFilter: 'blur(5px)'
              }}
              onMouseEnter={(e) => {
                if (pathname !== href) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (pathname !== href) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.border = '1px solid transparent';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <span style={{ fontSize: '16px' }}>{icon}</span>
              {label}
              {pathname === href && (
                <span style={{
                  position: 'absolute',
                  bottom: '2px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '20px',
                  height: '2px',
                  background: 'linear-gradient(90deg, #00d4ff, #0070f3)',
                  borderRadius: '1px'
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
              background: 'linear-gradient(135deg, #ff4757 0%, #ff3742 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 2px 8px rgba(255, 71, 87, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #ff3742 0%, #ff2730 100%)';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 71, 87, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #ff4757 0%, #ff3742 100%)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 71, 87, 0.3)';
            }}
          >
            <span style={{ fontSize: '16px' }}>🚪</span>
            Logout
          </a>
        </div>
      </div>

      {/* Add keyframe animation styles */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        /* Responsive design */
        @media (max-width: 768px) {
          nav {
            display: none !important;
          }
        }
        
        @media (max-width: 1024px) {
          nav a {
            min-width: 60px !important;
            padding: 8px 12px !important;
          }
          nav a span:first-child {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}