'use client';

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Progress page error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
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
            maxWidth: '400px'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px'
            }}>⚠️</div>
            <h2 style={{
              color: '#DC2626',
              marginBottom: '8px',
              fontSize: '1.5rem'
            }}>Something went wrong</h2>
            <p style={{
              color: '#4A5568',
              fontSize: '14px',
              marginBottom: '24px'
            }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              style={{
                padding: '8px 24px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: '#0A1628',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: '"Century Gothic", sans-serif'
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;