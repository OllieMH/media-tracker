import { RawgSearchResponse, RawgGame, SearchResult } from '@/types/media'

const BASE_URL = 'https://api.rawg.io/api'
const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY

function normalize(game: RawgGame): SearchResult {
  return {
    id: String(game.id),
    title: game.name,
    subtitle: game.released ? game.released.slice(0, 4) : null,
    coverUrl: game.background_image ?? null,
    metadata: {
      released: game.released,
      rating: game.rating,
      genres: game.genres?.map((g) => g.name) ?? [],
    },
  }
}

export async function searchGames(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return []
  const res = await fetch(
    `${BASE_URL}/games?search=${encodeURIComponent(query)}&key=${API_KEY}&page_size=20`
  )
  if (!res.ok) throw new Error(`RAWG error: ${res.status}`)
  const data: RawgSearchResponse = await res.json()
  return data.results.map(normalize)
}
