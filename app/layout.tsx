import { Metadata } from 'next'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Progress Bar Generator',
  description: 'Create beautiful, customizable progress bars for your projects with just a few clicks',
  openGraph: {
    title: 'Progress Bar Generator',
    description: 'Create beautiful, customizable progress bars for your projects with just a few clicks',
    url: 'https://progress-bars-eight.vercel.app',
    siteName: 'Progress Bar Generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Progress Bar Generator',
    description: 'Create beautiful, customizable progress bars for your projects with just a few clicks',
    creator: '@EntchenEric',
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ 
          WebkitTextSizeAdjust: '100%',
          touchAction: 'manipulation'
        }}
      >
        {children}
      </body>
    </html>
  )
}
