'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user && !isLoading) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return null;
  }

  return (
    <main>
      <div>
        <h1>Data Center Operations Portal</h1>
        <p>Secure access to operational procedures</p>
        <a href="/api/auth/login">Login to Access Documents</a>
      </div>
    </main>
  );
}