import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Atharva Sharma — Electronics Engineer & Creative Developer',
  description: 'Portfolio of Atharva Sharma. VLSI • Embedded Systems • Full-Stack • Drone Systems.',
  keywords: ['VLSI', 'Electronics Engineer', 'ECE', 'IIIT Nagpur', 'IIT Madras', 'Creative Developer'],
  openGraph: {
    title: 'Atharva Sharma',
    description: 'Bridging hardware and intelligence.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-bg text-fg antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
