import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import AuthProvider from '@/components/AuthProvider'
import SettingsProvider from '@/components/SettingsProvider'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })

export const metadata: Metadata = {
  title: 'Media Tracker',
  description: 'Track your books, movies, series, and games',
}

// Runs before React hydrates to prevent flash of wrong font size
const initScript = `(function(){try{
  var f=localStorage.getItem('fontSize')||'md';
  if(f==='sm')document.documentElement.style.fontSize='14px';
  else if(f==='lg')document.documentElement.style.fontSize='18px';
}catch(e){}})()`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
      </head>
      <body className={`${spaceGrotesk.variable} font-sans bg-zinc-950 text-zinc-100 antialiased`}>
        <AuthProvider>
          <SettingsProvider>
            <Navigation />
            <main className="mx-auto max-w-6xl px-4 py-8">
              {children}
            </main>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
