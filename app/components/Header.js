'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { user, isLoading } = useUser();
  const pathname = usePathname();

  if (isLoading) return null;
  if (!user) return null;

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/progress', label: 'Progress' },
    { href: '/risk', label: 'Risk' },
    { href: '/mop', label: 'MOPs' },
    { href: '/sop', label: 'SOPs' },
    { href: '/eop', label: 'EOPs' },
    { href: '/documents', label: 'Documents' },
  ];

  const isActive = (href) => pathname === href;

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: 'rgba(10, 22, 40, 0.95)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 16px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px'
        }}>
          {/* Logo - Glenart Group */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="/Glenart (3).svg"
              alt="Glenart Group"
              style={{
                height: '80px',
                width: 'auto',
                filter: 'brightness(0) invert(1)'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* Center Navigation - All 5 buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  borderRadius: '8px',
                  backgroundColor: isActive(link.href) ? '#FFFFFF' : 'transparent',
                  color: isActive(link.href) ? '#0A1628' : '#9CA3AF',
                  border: isActive(link.href) ? 'none' : '1px solid rgba(255, 255, 255, 0.2)'
                }}
                onMouseEnter={(e) => {
                  if (!isActive(link.href)) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.color = '#FFFFFF';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.href)) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#9CA3AF';
                  }
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side - Auth0 Profile and Logout */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            {/* Auth0 Profile Circle */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#3B82F6',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                {user.email ? user.email[0].toUpperCase() : 'U'}
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column'
              }}>
                <span style={{
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {user.name || user.email?.split('@')[0]}
                </span>
                <span style={{
                  color: '#9CA3AF',
                  fontSize: '12px'
                }}>
                  {user.email}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <a
              href="/api/auth/logout"
              style={{
                padding: '8px 20px',
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#DC2626';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#EF4444';
              }}
            >
              Logout
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}