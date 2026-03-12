import { TmdbSearchResponse, TmdbSearchResult } from '@/types/media'

const BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY

export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w300'

async function tmdbFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}&api_key=${API_KEY}`)
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`)
  return res.json()
}

export async function searchMovies(query: string): Promise<TmdbSearchResult[]> {
  if (!query.trim()) return []
  const data = await tmdbFetch<TmdbSearchResponse>(
    `/search/movie?query=${encodeURIComponent(query)}`
  )
  return data.results
}

export async function searchSeries(query: string): Promise<TmdbSearchResult[]> {
  if (!query.trim()) return []
  const data = await tmdbFetch<TmdbSearchResponse>(
    `/search/tv?query=${encodeURIComponent(query)}`
  )
  return data.results
}
