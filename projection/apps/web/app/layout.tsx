import type { Metadata } from 'next'
import './globals.css';

export const metadata: Metadata = {
  title: 'Nestly',
  description: 'Nestly helps you plan and project your retirement growth across web and mobile.',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
}


import { CssBaseline, GlobalStyles } from "@mui/material";
import { Providers } from "./providers";
import NavBar from "../components/NavBar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Inter font from Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/favicon-96x96.png" sizes="96x96" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body style={{ margin: 0 }}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            ':root': { fontFamily: "'Inter', system-ui, sans-serif" },
            'html, body, #__next, main': {
              margin: 0,
              padding: 0,
              minHeight: '100%',
            },
            body: { margin: '0 !important', padding: 0 },
          }}
        />
        <Providers>
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
