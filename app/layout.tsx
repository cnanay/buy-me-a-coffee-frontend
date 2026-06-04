import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { SITE_URL } from '@/lib/links';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Buy Me A Coffee — on-chain tip jar',
  description:
    'Tip me a coffee on-chain. A web3 tip jar running on the Sepolia testnet.',
  openGraph: {
    title: 'Buy Me A Coffee — on-chain tip jar',
    description:
      'Tip me a coffee on-chain. A web3 tip jar running on the Sepolia testnet.',
    url: SITE_URL,
    siteName: 'Buy Me A Coffee',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
