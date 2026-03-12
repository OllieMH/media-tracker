'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MediaCategory, SearchResult } from '@/types/media'
import { addMediaItem } from '@/lib/mediaService'

interface Props {
  category: MediaCategory
  searchFn: (query: string) => Promise<SearchResult[]>
  placeholder?: string
  onAdded?: () => void
}

export default function MediaSearch({ category, searchFn, placeholder, onAdded }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [added, setAdded] = useState<Set<string>>(new Set())

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    try {
      setResults(await searchFn(query))
    } catch {
      setError('Failed to fetch results.')
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd(result: SearchResult) {
    try {
      await addMediaItem({
        title: result.title,
        category,
        status: 'backlog',
        rating: null,
        notes: null,
        api_id: result.id,
        cover_image_url: result.coverUrl,
        metadata: result.metadata,
      })
      setAdded((prev) => new Set(prev).add(result.id))
      onAdded?.()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add item')
    }
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder ?? `Search for a ${category}...`}
          className="flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

      {results.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {results.map((result) => (
            <div
              key={result.id}
              className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
            >
              {result.coverUrl ? (
                <Image
                  src={result.coverUrl}
                  alt={result.title}
                  width={300}
                  height={450}
                  className="w-full object-cover"
                />
              ) : (
                <div className="flex h-48 items-center justify-center bg-zinc-100 text-sm text-zinc-400 dark:bg-zinc-800">
                  No image
                </div>
              )}
              <div className="p-3">
                <p className="text-sm font-medium leading-tight">{result.title}</p>
                {result.subtitle && (
                  <p className="mt-1 text-xs text-zinc-500">{result.subtitle}</p>
                )}
                <button
                  onClick={() => handleAdd(result)}
                  disabled={added.has(result.id)}
                  className="mt-2 w-full rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                >
                  {added.has(result.id) ? '✓ Added' : '+ Add to backlog'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && results.length === 0 && query && (
        <p className="text-sm text-zinc-500">No results found.</p>
      )}
    </div>
  )
}
