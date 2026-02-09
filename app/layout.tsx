import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Umar Zeb - AI Engineer',
  description: 'AI Engineer | Building AGI Systems',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
