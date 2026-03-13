'use client'

import { useState } from 'react'
import MovieSearch from '@/components/MovieSearch'
import MediaList from '@/components/MediaList'
import ProtectedPage from '@/components/ProtectedPage'
import ErrorBoundary from '@/components/ErrorBoundary'

export default function MoviesPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <ProtectedPage>
      <div>
        <h1 className="mb-6 text-2xl font-semibold text-forest-400">Movies</h1>
        <MovieSearch onAdded={() => setRefreshKey((k) => k + 1)} />
        <hr className="my-8 border-zinc-200 dark:border-zinc-800" />
        <ErrorBoundary>
          <MediaList category="movie" refreshKey={refreshKey} />
        </ErrorBoundary>
      </div>
    </ProtectedPage>
  )
}
