import { TmdbSearchResponse, TmdbSearchResult, SearchResult } from '@/types/media'

const BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY

export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w300'

async function tmdbFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}&api_key=${API_KEY}`)
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`)
  return res.json()
}

function normalizeMovie(m: TmdbSearchResult): SearchResult {
  return {
    id: String(m.id),
    title: m.title ?? 'Untitled',
    subtitle: m.release_date ? m.release_date.slice(0, 4) : null,
    coverUrl: m.poster_path ? `${TMDB_IMAGE_BASE}${m.poster_path}` : null,
    metadata: {
      overview: m.overview,
      release_date: m.release_date,
      vote_average: m.vote_average,
    },
  }
}

function normalizeSeries(m: TmdbSearchResult): SearchResult {
  return {
    id: String(m.id),
    title: m.name ?? 'Untitled',
    subtitle: m.first_air_date ? m.first_air_date.slice(0, 4) : null,
    coverUrl: m.poster_path ? `${TMDB_IMAGE_BASE}${m.poster_path}` : null,
    metadata: {
      overview: m.overview,
      first_air_date: m.first_air_date,
      vote_average: m.vote_average,
    },
  }
}

export async function searchMovies(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return []
  const data = await tmdbFetch<TmdbSearchResponse>(
    `/search/movie?query=${encodeURIComponent(query)}`
  )
  return data.results.map(normalizeMovie)
}

export async function searchSeries(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return []
  const data = await tmdbFetch<TmdbSearchResponse>(
    `/search/tv?query=${encodeURIComponent(query)}`
  )
  return data.results.map(normalizeSeries)
}
