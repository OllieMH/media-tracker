import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Media Tracker',
  description: 'Track your books, movies, series, and games',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-zinc-50 text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100`}>
        <Navigation />
        <main className="mx-auto max-w-6xl px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
