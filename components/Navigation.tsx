'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/components/AuthProvider'

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/movies', label: 'Movies' },
  { href: '/series', label: 'Series' },
  { href: '/books', label: 'Books' },
  { href: '/games', label: 'Games' },
]

export default function Navigation() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center gap-6">
          <span className="flex-shrink-0 font-semibold text-forest-400">
            Media Tracker
          </span>

          {/* Desktop nav links */}
          <div className="hidden flex-1 gap-1 md:flex">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  pathname === href
                    ? 'bg-forest-900/60 font-medium text-forest-400'
                    : 'text-zinc-500 hover:text-zinc-200 dark:text-zinc-400 dark:hover:text-zinc-100'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop user info */}
          {user && (
            <div className="hidden items-center gap-3 md:flex">
              <span className="text-xs text-zinc-400">
                {(user.user_metadata?.display_name as string) || user.email}
              </span>
              <Link
                href="/settings"
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  pathname === '/settings'
                    ? 'bg-forest-900/60 font-medium text-forest-400'
                    : 'text-zinc-500 hover:text-zinc-200 dark:text-zinc-400 dark:hover:text-zinc-100'
                }`}
              >
                Settings
              </Link>
              <button
                onClick={signOut}
                className="rounded-md px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                Sign out
              </button>
            </div>
          )}

          {/* Mobile: push hamburger to right */}
          <div className="flex flex-1 justify-end md:hidden">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              className="rounded-md p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              {menuOpen ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4l12 12M16 4L4 16" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 5h14M3 10h14M3 15h14" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="border-t border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-md px-3 py-2 text-sm transition-colors ${
                  pathname === href
                    ? 'bg-forest-900/60 font-medium text-forest-400'
                    : 'text-zinc-500 hover:text-zinc-200 dark:text-zinc-400 dark:hover:text-zinc-100'
                }`}
              >
                {label}
              </Link>
            ))}
            {user && (
              <>
                <div className="my-2 border-t border-zinc-100 dark:border-zinc-800" />
                <span className="px-3 text-xs text-zinc-400">
                  {(user.user_metadata?.display_name as string) || user.email}
                </span>
                <Link
                  href="/settings"
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-md px-3 py-2 text-sm transition-colors ${
                    pathname === '/settings'
                      ? 'bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
                      : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                  }`}
                >
                  Settings
                </Link>
                <button
                  onClick={() => { setMenuOpen(false); signOut() }}
                  className="rounded-md px-3 py-2 text-left text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  Sign out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
