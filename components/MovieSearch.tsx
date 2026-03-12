'use client'

import { useState } from 'react'
import Image from 'next/image'
import { searchMovies, TMDB_IMAGE_BASE } from '@/lib/apiClients/tmdb'
import { TmdbSearchResult } from '@/types/media'
import { addMediaItem } from '@/lib/mediaService'

interface Props {
  onAdded?: () => void
}

export default function MovieSearch({ onAdded }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<TmdbSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [added, setAdded] = useState<Set<number>>(new Set())

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError(null)
    try {
      const data = await searchMovies(query)
      setResults(data)
    } catch {
      setError('Failed to fetch results. Check your API key.')
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd(movie: TmdbSearchResult) {
    try {
      await addMediaItem({
        title: movie.title ?? 'Untitled',
        category: 'movie',
        status: 'backlog',
        rating: null,
        notes: null,
        api_id: String(movie.id),
        cover_image_url: movie.poster_path
          ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
          : null,
        metadata: {
          overview: movie.overview,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
        },
      })
      setAdded((prev) => new Set(prev).add(movie.id))
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
          placeholder="Search for a movie..."
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

      {error && (
        <p className="mb-4 text-sm text-red-500">{error}</p>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {results.map((movie) => (
            <div
              key={movie.id}
              className="rounded-lg border border-zinc-200 bg-white overflow-hidden dark:border-zinc-800 dark:bg-zinc-900"
            >
              {movie.poster_path ? (
                <Image
                  src={`${TMDB_IMAGE_BASE}${movie.poster_path}`}
                  alt={movie.title ?? ''}
                  width={300}
                  height={450}
                  className="w-full object-cover"
                />
              ) : (
                <div className="flex h-48 items-center justify-center bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
                  No image
                </div>
              )}
              <div className="p-3">
                <p className="text-sm font-medium leading-tight">{movie.title}</p>
                {movie.release_date && (
                  <p className="mt-1 text-xs text-zinc-500">
                    {movie.release_date.slice(0, 4)}
                  </p>
                )}
                <button
                  onClick={() => handleAdd(movie)}
                  disabled={added.has(movie.id)}
                  className="mt-2 w-full rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                >
                  {added.has(movie.id) ? '✓ Added' : '+ Add to backlog'}
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
