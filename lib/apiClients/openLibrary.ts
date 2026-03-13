import { OpenLibrarySearchResponse, OpenLibraryDoc, SearchResult } from '@/types/media'

const BASE_URL = 'https://openlibrary.org'

const KNOWN_GENRES = new Set([
  'Fantasy', 'Epic fantasy', 'Dark fantasy', 'Urban fantasy',
  'Science fiction', 'Hard science fiction', 'Space opera', 'Dystopian fiction', 'Cyberpunk',
  'Horror', 'Gothic fiction',
  'Mystery', 'Detective fiction', 'Noir fiction', 'Crime fiction',
  'Thriller', 'Psychological thriller', 'Spy fiction',
  'Romance', 'Historical romance', 'Paranormal romance',
  'Historical fiction',
  'Literary fiction', 'Contemporary fiction',
  'Adventure', 'Action',
  'Biography', 'Autobiography', 'Memoir',
  'Self-help', 'Personal development',
  'Non-fiction', 'True crime',
  'Young adult fiction', 'Young adult', 'Children fiction', "Children's literature",
  'Graphic novel', 'Comics',
  'Short stories', 'Anthology',
  'Philosophy', 'Religion', 'Spirituality',
  'History', 'Politics', 'Economics',
  'Science', 'Popular science', 'Mathematics',
  'Travel', 'Nature', 'Environment',
  'Poetry', 'Drama',
])

function matchGenres(subjects: string[]): string[] {
  const results: string[] = []
  for (const subject of subjects) {
    const normalized = subject.trim()
    if (KNOWN_GENRES.has(normalized)) {
      results.push(normalized)
      if (results.length === 5) break
    }
  }
  return results
}

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
      genres: matchGenres(doc.subject ?? []),
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
  return matchGenres(data.subjects ?? [])
}
