import { OpenLibrarySearchResponse, OpenLibraryDoc, SearchResult } from '@/types/media'

const BASE_URL = 'https://openlibrary.org'

function normalize(doc: OpenLibraryDoc): SearchResult {
  return {
    id: doc.key,
    title: doc.title,
    subtitle: [
      doc.author_name?.[0],
      doc.first_publish_year ? String(doc.first_publish_year) : null,
    ]
      .filter(Boolean)
      .join(' · ') || null,
    coverUrl: doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
      : null,
    metadata: {
      authors: doc.author_name ?? [],
      first_publish_year: doc.first_publish_year,
      genres: doc.subject?.slice(0, 5) ?? [],
    },
  }
}

export async function searchBooks(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return []
  const res = await fetch(
    `${BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=20&fields=key,title,author_name,cover_i,first_publish_year,subject`
  )
  if (!res.ok) throw new Error(`OpenLibrary error: ${res.status}`)
  const data: OpenLibrarySearchResponse = await res.json()
  return data.docs.map(normalize)
}

export async function fetchBookGenres(apiId: string): Promise<string[]> {
  const res = await fetch(`${BASE_URL}${apiId}.json`)
  if (!res.ok) return []
  const data: { subjects?: string[] } = await res.json()
  return data.subjects?.slice(0, 5) ?? []
}
