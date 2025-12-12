import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Snap-Self | Sistema Inteligente para Fotógrafos',
    template: '%s | Snap-Self',
  },
  description:
    'Plataforma all-in-one com IA para gestão de fotografia profissional. Organize, entregue e receba pagamentos de forma inteligente.',
  keywords: [
    'fotografia',
    'gestão de fotos',
    'IA para fotógrafos',
    'galeria de fotos',
    'fotografia profissional',
  ],
  authors: [{ name: 'Snap-Self Team' }],
  creator: 'Snap-Self',
  metadataBase: new URL('https://snapself.com.br'),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://snapself.com.br',
    title: 'Snap-Self | Sistema Inteligente para Fotógrafos',
    description:
      'Plataforma all-in-one com IA para gestão de fotografia profissional',
    siteName: 'Snap-Self',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Snap-Self | Sistema Inteligente para Fotógrafos',
    description:
      'Plataforma all-in-one com IA para gestão de fotografia profissional',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
