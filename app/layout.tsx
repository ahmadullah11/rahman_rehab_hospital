import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import ProgressBar from '@/components/ProgressBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Rahman Rehab | Rehabilitation & Psychiatry Treatment Hospital',
  description:
    'Rahman Rehab & Psychiatry Treatment Hospital offers evidence-based addiction treatment, psychiatric care and rehabilitation in Peshawar and Matta, Swat. Admissions open 24/7.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="%232f6b4f" stroke-width="2"><path d="M16 29V14"/><path d="M16 18c-5 0-9-3.5-9-9 5 0 9 3.5 9 9z"/><path d="M16 14c0-5 3.5-9 9-9 0 5-3.5 9-9 9z"/></svg>'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        {/*
          Theme initializer. Kept at the top of <body> (not <head>) because
          browser extensions commonly inject scripts into <head> before React
          hydrates, which shifts the node order and causes a hydration mismatch
          on this inline script. It still runs before any content paints.
        */}
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme');var p=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.setAttribute('data-theme',s||(p?'dark':'light'));}catch(e){}})();`
          }}
        />
        <AuthProvider>
          <ProgressBar />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
