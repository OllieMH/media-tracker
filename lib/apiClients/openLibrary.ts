import { OpenLibrarySearchResponse, OpenLibraryDoc, SearchResult } from "@/types/media";

const BASE_URL = "https://openlibrary.org";

const KNOWN_GENRES: Record<string, string> = {
	fantasy: "Fantasy",
	"epic fantasy": "Epic Fantasy",
	"dark fantasy": "Dark Fantasy",
	"urban fantasy": "Urban Fantasy",
	"science fiction": "Science Fiction",
	"hard science fiction": "Hard Science Fiction",
	"space opera": "Space Opera",
	"dystopian fiction": "Dystopian",
	dystopia: "Dystopian",
	cyberpunk: "Cyberpunk",
	horror: "Horror",
	"gothic fiction": "Gothic",
	mystery: "Mystery",
	"detective fiction": "Mystery",
	"noir fiction": "Noir",
	"crime fiction": "Crime",
	thriller: "Thriller",
	"psychological thriller": "Psychological Thriller",
	"spy fiction": "Spy Fiction",
	romance: "Romance",
	"historical romance": "Historical Romance",
	"paranormal romance": "Paranormal Romance",
	"historical fiction": "Historical Fiction",
	"literary fiction": "Literary Fiction",
	"contemporary fiction": "Contemporary Fiction",
	adventure: "Adventure",
	biography: "Biography",
	autobiography: "Autobiography",
	memoir: "Memoir",
	"self-help": "Self-Help",
	"personal development": "Self-Help",
	nonfiction: "Non-Fiction",
	"non-fiction": "Non-Fiction",
	"true crime": "True Crime",
	"young adult fiction": "Young Adult",
	"young adult": "Young Adult",
	"children's literature": "Children's",
	"graphic novel": "Graphic Novel",
	comics: "Comics",
	"short stories": "Short Stories",
	anthology: "Anthology",
	philosophy: "Philosophy",
	history: "History",
	politics: "Politics",
	science: "Science",
	"popular science": "Popular Science",
	travel: "Travel",
	poetry: "Poetry",
	drama: "Drama",
};

function matchGenres(subjects: string[]): string[] {
	const seen = new Set<string>();
	const results: string[] = [];
	for (const subject of subjects) {
		const key = subject.trim().toLowerCase();
		const mapped = KNOWN_GENRES[key];
		if (mapped && !seen.has(mapped)) {
			seen.add(mapped);
			results.push(mapped);
			if (results.length === 5) break;
		}
	}
	return results;
}

function normalize(doc: OpenLibraryDoc): SearchResult {
	return {
		id: doc.key,
		title: doc.title,
		subtitle: [doc.author_name?.[0], doc.first_publish_year ? String(doc.first_publish_year) : null].filter(Boolean).join(" · ") || null,
		coverUrl: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : null,
		metadata: {
			authors: doc.author_name ?? [],
			first_publish_year: doc.first_publish_year,
			genres: matchGenres(doc.subject ?? []),
			genres_v: 2,
		},
	};
}

export async function searchBooks(query: string): Promise<SearchResult[]> {
	if (!query.trim()) return [];
	const res = await fetch(`${BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=20&fields=key,title,author_name,cover_i,first_publish_year,subject`);
	if (!res.ok) throw new Error(`OpenLibrary error: ${res.status}`);
	const data: OpenLibrarySearchResponse = await res.json();
	return data.docs.map(normalize);
}

export async function fetchBookGenres(apiId: string): Promise<string[]> {
	const res = await fetch(`${BASE_URL}${apiId}.json`);
	if (!res.ok) return [];
	const data: { subjects?: string[] } = await res.json();
	return matchGenres(data.subjects ?? []);
}
