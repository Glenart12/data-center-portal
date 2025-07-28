'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { usePathname } from 'next/navigation';

// Consistent color scheme for the entire site
export const SITE_COLORS = {
  primary: '#0f3456', // Main dark blue from header
  primaryLight: '#1e4a72', // Lighter version for hover states
  accent: '#00d4ff', // Bright blue accent
  accentDark: '#0070f3', // Darker accent blue
  gradient: 'linear-gradient(135deg, #0f3456 0%, #1e4a72 100%)',
  accentGradient: 'linear-gradient(135deg, #00d4ff 0%, #0070f3 100%)',
  success: '#28a745',
  warning: '#ffc107',
  danger: '#dc3545',
  white: '#ffffff',
  lightGray: 'rgba(255, 255, 255, 0.1)',
  mediumGray: 'rgba(255, 255, 255, 0.2)',
  darkGray: 'rgba(0, 0, 0, 0.1)'
};

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
      background: SITE_COLORS.gradient,
      backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${SITE_COLORS.lightGray}`,
      padding: '16px 24px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: `0 8px 32px ${SITE_COLORS.primary}4D`, // 4D = 30% opacity
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
            background: SITE_COLORS.accentGradient,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 12px ${SITE_COLORS.accentDark}4D`,
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
              color: SITE_COLORS.white,
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
          background: SITE_COLORS.lightGray,
          padding: '6px',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${SITE_COLORS.lightGray}`
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
                padding: '10px 20px',
                backgroundColor: isActivePage(href) ? SITE_COLORS.mediumGray : 'transparent',
                color: isActivePage(href) ? SITE_COLORS.white : 'rgba(255, 255, 255, 0.9)',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: isActivePage(href) ? '600' : '500',
                border: isActivePage(href) ? `1px solid ${SITE_COLORS.mediumGray}` : '1px solid transparent',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                minWidth: '80px',
                backdropFilter: 'blur(5px)'
              }}
              onMouseEnter={(e) => {
                if (!isActivePage(href)) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.border = `1px solid ${SITE_COLORS.mediumGray}`;
                  e.currentTarget.style.color = SITE_COLORS.white;
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActivePage(href)) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.border = '1px solid transparent';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {label}
              {isActivePage(href) && (
                <span style={{
                  position: 'absolute',
                  bottom: '2px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '20px',
                  height: '2px',
                  background: SITE_COLORS.accentGradient,
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
            background: SITE_COLORS.lightGray,
            borderRadius: '8px',
            border: `1px solid ${SITE_COLORS.lightGray}`,
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: SITE_COLORS.accentGradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: SITE_COLORS.white,
              fontSize: '14px',
              fontWeight: 'bold',
              boxShadow: `0 2px 8px ${SITE_COLORS.accentDark}4D`
            }}>
              {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div style={{ 
                color: SITE_COLORS.white, 
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
              background: `linear-gradient(135deg, ${SITE_COLORS.danger} 0%, #ff3742 100%)`,
              color: SITE_COLORS.white,
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              border: `1px solid ${SITE_COLORS.lightGray}`,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: `0 2px 8px ${SITE_COLORS.danger}4D`,
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #ff3742 0%, #ff2730 100%)';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = `0 4px 12px ${SITE_COLORS.danger}66`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, ${SITE_COLORS.danger} 0%, #ff3742 100%)`;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 2px 8px ${SITE_COLORS.danger}4D`;
            }}
          >
            🚪 Logout
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
            font-size: 13px !important;
          }
        }
      `}</style>
    </header>
  );
}