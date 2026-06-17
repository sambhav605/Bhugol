import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Bhugol | Nepal Districts Quiz',
  description:
    'Can you name all 77 districts of Nepal in 15 minutes? Type to fill in the map.',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  if (process.env.MAINTENANCE_MODE === 'true') {
    return (
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable} bg-background`}>
        <body className="font-sans antialiased">
          <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
            <h1 className="text-3xl font-bold mb-4">🛠️ Under Maintenance</h1>
            <p className="text-muted-foreground">We're working on something. Check back soon!</p>
          </div>
        </body>
      </html>
    )
  }

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}