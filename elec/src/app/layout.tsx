"use client";
import { Inter } from 'next/font/google';
import '../css/home.css';
import { NextAuthProvider } from '../../providers/NextAuthProvider';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any; // Adjust type as needed
}) {
  return (
    <html lang="en" className='overflow-x-hidden'>
      <body className='overflow-hidden relative'>
        <NextAuthProvider>
          <main className='relative overflow-hidden'>
            {children}
          </main>
        </NextAuthProvider>
      </body>
    </html>
  );
}
