import { TmdbSearchResponse, TmdbSearchResult, SearchResult } from '@/types/media'

const BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY

export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w300'

async function tmdbFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}&api_key=${API_KEY}`)
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`)
  return res.json()
}

const genreCache: { movie: Map<number, string>; tv: Map<number, string> } = {
  movie: new Map(),
  tv: new Map(),
}

async function getGenreMap(type: 'movie' | 'tv'): Promise<Map<number, string>> {
  if (genreCache[type].size > 0) return genreCache[type]
  const data = await tmdbFetch<{ genres: { id: number; name: string }[] }>(
    `/genre/${type}/list?language=en`
  )
  const map = new Map(data.genres.map((g) => [g.id, g.name]))
  genreCache[type] = map
  return map
}

function resolveGenres(ids: number[], map: Map<number, string>): string[] {
  return ids.map((id) => map.get(id)).filter(Boolean) as string[]
}

function normalizeMovie(m: TmdbSearchResult, genreMap: Map<number, string>): SearchResult {
  return {
    id: String(m.id),
    title: m.title ?? 'Untitled',
    subtitle: m.release_date ? m.release_date.slice(0, 4) : null,
    coverUrl: m.poster_path ? `${TMDB_IMAGE_BASE}${m.poster_path}` : null,
    metadata: {
      overview: m.overview,
      release_date: m.release_date,
      vote_average: m.vote_average,
      genres: resolveGenres(m.genre_ids, genreMap),
    },
  }
}

function normalizeSeries(m: TmdbSearchResult, genreMap: Map<number, string>): SearchResult {
  return {
    id: String(m.id),
    title: m.name ?? 'Untitled',
    subtitle: m.first_air_date ? m.first_air_date.slice(0, 4) : null,
    coverUrl: m.poster_path ? `${TMDB_IMAGE_BASE}${m.poster_path}` : null,
    metadata: {
      overview: m.overview,
      first_air_date: m.first_air_date,
      vote_average: m.vote_average,
      genres: resolveGenres(m.genre_ids, genreMap),
    },
  }
}

export async function searchMovies(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return []
  const [data, genreMap] = await Promise.all([
    tmdbFetch<TmdbSearchResponse>(`/search/movie?query=${encodeURIComponent(query)}`),
    getGenreMap('movie'),
  ])
  return data.results.map((m) => normalizeMovie(m, genreMap))
}

export async function fetchGenres(apiId: string, type: 'movie' | 'tv'): Promise<string[]> {
  const data = await tmdbFetch<{ genres: { id: number; name: string }[] }>(
    `/${type}/${apiId}?language=en`
  )
  return data.genres.map((g) => g.name)
}

export async function searchSeries(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return []
  const [data, genreMap] = await Promise.all([
    tmdbFetch<TmdbSearchResponse>(`/search/tv?query=${encodeURIComponent(query)}`),
    getGenreMap('tv'),
  ])
  return data.results.map((m) => normalizeSeries(m, genreMap))
}
