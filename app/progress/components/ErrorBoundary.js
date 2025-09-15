'use client';

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Handle initialization errors specifically
    if (error?.message?.includes('Cannot access') || error?.message?.includes('before initialization')) {
      return { 
        hasError: true, 
        error: { ...error, isInitError: true }
      };
    }
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Progress page error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      const isInitError = this.state.error?.isInitError;
      
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#F9FAFB'
        }}>
          <div style={{
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
            padding: '32px',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            maxWidth: '500px'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px'
            }}>{isInitError ? '🔄' : '⚠️'}</div>
            <h2 style={{
              color: '#DC2626',
              marginBottom: '8px',
              fontSize: '1.5rem'
            }}>
              {isInitError ? 'Initialization Error' : 'Something went wrong'}
            </h2>
            <p style={{
              color: '#4A5568',
              fontSize: '14px',
              marginBottom: '24px'
            }}>
              {isInitError 
                ? 'The page components failed to initialize properly. This can happen after code updates. Please refresh the page to resolve this issue.'
                : (this.state.error?.message || 'An unexpected error occurred')}
            </p>
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => {
                  window.location.reload();
                }}
                style={{
                  padding: '10px 24px',
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: '#0A1628',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#0F1E36';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#0A1628';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                🔄 Refresh Page
              </button>
              {!isInitError && (
                <button
                  onClick={() => {
                    this.setState({ hasError: false, error: null, errorInfo: null });
                  }}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '4px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    color: '#4A5568',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#F9FAFB';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#FFFFFF';
                  }}
                >
                  Try Again
                </button>
              )}
            </div>
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details style={{
                marginTop: '24px',
                padding: '12px',
                backgroundColor: '#F9FAFB',
                borderRadius: '4px',
                textAlign: 'left',
                fontSize: '12px',
                color: '#4A5568'
              }}>
                <summary style={{
                  cursor: 'pointer',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  Error Details (Development Only)
                </summary>
                <pre style={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  margin: 0
                }}>
                  {this.state.error?.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;