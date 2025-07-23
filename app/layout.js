import { UserProvider } from '@auth0/nextjs-auth0/client';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <h1>Testing Auth0 in Layout</h1>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}