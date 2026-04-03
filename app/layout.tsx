import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs'; // import ClerkProvider
import './globals.css';

export const metadata: Metadata = {
  title: 'Threat Dashboard',
  description: 'CVE Threat Intelligence',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>  {/* wraps entire app — provides auth context */}
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}