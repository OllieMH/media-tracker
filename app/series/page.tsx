'use client'

import { useState } from 'react'
import MediaSearch from '@/components/MediaSearch'
import MediaList from '@/components/MediaList'
import { searchSeries } from '@/lib/apiClients/tmdb'
import ProtectedPage from '@/components/ProtectedPage'

export default function SeriesPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <ProtectedPage>
      <div>
        <h1 className="mb-6 text-2xl font-semibold">Series</h1>
        <MediaSearch
          category="series"
          searchFn={searchSeries}
          placeholder="Search for a series..."
          onAdded={() => setRefreshKey((k) => k + 1)}
        />
        <hr className="my-8 border-zinc-200 dark:border-zinc-800" />
        <MediaList category="series" refreshKey={refreshKey} />
      </div>
    </ProtectedPage>
  )
}
