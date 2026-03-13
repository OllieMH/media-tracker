'use client'

import { useState } from 'react'
import MediaSearch from '@/components/MediaSearch'
import MediaList from '@/components/MediaList'
import { searchGames } from '@/lib/apiClients/steam'
import ProtectedPage from '@/components/ProtectedPage'
import ErrorBoundary from '@/components/ErrorBoundary'

export default function GamesPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <ProtectedPage>
      <div>
        <h1 className="mb-6 text-2xl font-semibold">Games</h1>
        <MediaSearch
          category="game"
          searchFn={searchGames}
          placeholder="Search for a game..."
          onAdded={() => setRefreshKey((k) => k + 1)}
        />
        <hr className="my-8 border-zinc-200 dark:border-zinc-800" />
        <ErrorBoundary>
          <MediaList category="game" refreshKey={refreshKey} />
        </ErrorBoundary>
      </div>
    </ProtectedPage>
  )
}
