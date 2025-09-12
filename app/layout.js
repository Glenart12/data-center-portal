import { UserProvider } from '@auth0/nextjs-auth0/client';
import Header from './components/Header';
import { NotificationProvider } from './contexts/NotificationContext';

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
        backgroundColor: '#FFFFFF',
        minHeight: '100vh'
      }}>
        <UserProvider>
          <NotificationProvider>
            <Header />
            <main style={{
              position: 'relative',
              zIndex: 1
            }}>
              {children}
            </main>
          </NotificationProvider>
        </UserProvider>
      </body>
    </html>
  );
}