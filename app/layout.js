import { UserProvider } from '@auth0/nextjs-auth0/client';
import Header from './components/Header';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Century+Gothic:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{
        margin: 0,
        padding: 0,
        fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif',
        backgroundImage: 'url("/Data-Centre-Stock-04.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh'
      }}>
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: -1
        }} />
        
        <UserProvider>
          <Header />
          <main style={{
            position: 'relative',
            zIndex: 1
          }}>
            {children}
          </main>
        </UserProvider>
      </body>
    </html>
  );
}