'use client';

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from 'react';

function Progress() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1>Progress Tracking</h1>
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <p>Gantt Chart - Week 1-16</p>
        <div style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
          ALL MOP WORK - Weeks 1-8
        </div>
        <div style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
          ALL SOP WORK - Weeks 8-12
        </div>
        <div style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
          ALL EOP WORK - Weeks 12-16
        </div>
      </div>
    </div>
  );
}

export default withPageAuthRequired(Progress);