import type { Metadata } from 'next';
import { Providers } from '@/shared/components/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Slack Clone — Linear Style',
  description: 'A minimal Slack clone with Linear-inspired monochrome design',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
