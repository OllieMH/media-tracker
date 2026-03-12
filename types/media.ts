export type MediaCategory = 'book' | 'movie' | 'series' | 'game'

export type MediaStatus = 'backlog' | 'in_progress' | 'completed'

export interface MediaItem {
  id: string
  user_id: string
  title: string
  category: MediaCategory
  status: MediaStatus
  rating: number | null
  notes: string | null
  api_id: string | null
  cover_image_url: string | null
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export type NewMediaItem = Omit<MediaItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>

// TMDB
export interface TmdbSearchResult {
  id: number
  title?: string       // movies
  name?: string        // series
  overview: string
  poster_path: string | null
  release_date?: string
  first_air_date?: string
  vote_average: number
}

export interface TmdbSearchResponse {
  results: TmdbSearchResult[]
  total_results: number
  total_pages: number
}

// OpenLibrary
export interface OpenLibraryDoc {
  key: string
  title: string
  author_name?: string[]
  cover_i?: number
  first_publish_year?: number
}

export interface OpenLibrarySearchResponse {
  docs: OpenLibraryDoc[]
  numFound: number
}
