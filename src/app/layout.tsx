import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

export const metadata: Metadata = {
  title: 'PHOTORNZ | Elite Studio Suite',
  description: 'The world\'s most exclusive event photography engine.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Inter:wght@400;700;900&family=Space+Mono:wght@400;700&family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-white text-black selection:bg-black/5">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
