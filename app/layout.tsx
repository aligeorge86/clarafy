import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Clarafy — Your legal documents, finally clear.',
    template: '%s · Clarafy',
  },
  description:
    "Clarafy translates legal documents into plain English. Upload a PDF or Word doc and get back the same document, same structure, written at a clear adult reading level. We don't speak legalese.",
  openGraph: {
    title: 'Clarafy — Your legal documents, finally clear.',
    description: "We don't speak legalese.",
    siteName: 'Clarafy',
    type: 'website',
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Nunito:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
