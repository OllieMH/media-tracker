import { SearchResult } from '@/types/media'

interface SteamSearchItem {
  id: number
  name: string
  tiny_image: string
}

interface SteamSearchResponse {
  items: SteamSearchItem[]
}

function coverUrl(appId: number): string {
  return `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`
}

export async function searchGames(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return []
  const res = await fetch(`/api/games/search?q=${encodeURIComponent(query)}`)
  if (!res.ok) throw new Error(`Steam error: ${res.status}`)
  const data: SteamSearchResponse = await res.json()
  return data.items.map((item) => ({
    id: String(item.id),
    title: item.name,
    subtitle: null,
    coverUrl: coverUrl(item.id),
    metadata: { steam_appid: item.id },
  }))
}
