'use client'

import { useState } from 'react'
import MediaSearch from '@/components/MediaSearch'
import MediaList from '@/components/MediaList'
import { searchBooks } from '@/lib/apiClients/openLibrary'
import ProtectedPage from '@/components/ProtectedPage'
import ErrorBoundary from '@/components/ErrorBoundary'

export default function BooksPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <ProtectedPage>
      <div>
        <h1 className="mb-6 text-2xl font-semibold">Books</h1>
        <MediaSearch
          category="book"
          searchFn={searchBooks}
          placeholder="Search for a book..."
          onAdded={() => setRefreshKey((k) => k + 1)}
        />
        <hr className="my-8 border-zinc-200 dark:border-zinc-800" />
        <ErrorBoundary>
          <MediaList category="book" refreshKey={refreshKey} />
        </ErrorBoundary>
      </div>
    </ProtectedPage>
  )
}
