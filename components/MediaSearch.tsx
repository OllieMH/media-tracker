"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MediaCategory, MediaStatus, SearchResult } from "@/types/media";
import { addMediaItem, getMediaItems } from "@/lib/mediaService";
import { SearchResultSkeleton } from "./SkeletonCards";

interface Props {
	category: MediaCategory;
	searchFn: (query: string) => Promise<SearchResult[]>;
	placeholder?: string;
	onAdded?: () => void;
}

export default function MediaSearch({ category, searchFn, placeholder, onAdded }: Props) {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<SearchResult[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [added, setAdded] = useState<Set<string>>(new Set());
	const [addError, setAddError] = useState<string | null>(null);
	const [existingIds, setExistingIds] = useState<Set<string>>(new Set());
	const [searched, setSearched] = useState(false);
	const [expanded, setExpanded] = useState(false);

	useEffect(() => {
		getMediaItems(category).then((items) => {
			const ids = new Set(items.map((i) => i.api_id).filter(Boolean) as string[]);
			setExistingIds(ids);
		});
	}, [category]);

	async function handleSearch(e: React.FormEvent) {
		e.preventDefault();
		if (!query.trim()) return;
		setLoading(true);
		setError(null);
		setExpanded(false);
		try {
			setResults(await searchFn(query));
			setSearched(true);
		} catch {
			setError("Failed to fetch results.");
		} finally {
			setLoading(false);
		}
	}

	function handleClose() {
		setResults([]);
		setSearched(false);
		setExpanded(false);
		setAdded(new Set());
	}

	async function handleAdd(result: SearchResult, status: MediaStatus) {
		setAddError(null);
		try {
			await addMediaItem({
				title: result.title,
				category,
				status,
				rating: null,
				notes: null,
				api_id: result.id,
				cover_image_url: result.coverUrl,
				metadata: result.metadata,
				is_favorite: false,
			});
			setAdded((prev) => new Set(prev).add(result.id));
			setExistingIds((prev) => new Set(prev).add(result.id));
			onAdded?.();
		} catch (err) {
			setAddError(err instanceof Error ? err.message : "Failed to add item");
		}
	}

	const visible = results.filter((r) => !existingIds.has(r.id));
	const shown = expanded ? visible : visible.slice(0, 5);

	return (
		<div>
			<form onSubmit={handleSearch} className="mb-6 flex gap-2">
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder={placeholder ?? `Search for a ${category}...`}
					className="flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:border-forest-500 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-forest-500"
				/>
				<button type="submit" disabled={loading} className="rounded-lg bg-forest-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-forest-500 disabled:opacity-50">
					{loading ? "Searching..." : "Search"}
				</button>
			</form>

			{error && <p className="mb-4 text-sm text-red-500">{error}</p>}
			{addError && <p className="mb-4 text-sm text-red-500">Could not add item: {addError}</p>}

			{loading && (
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
					{[1, 2, 3, 4, 5].map((n) => (
						<SearchResultSkeleton key={n} />
					))}
				</div>
			)}

			{!loading && searched && visible.length === 0 && (
				<p className="text-sm text-zinc-500">No results found.</p>
			)}

			{!loading && visible.length > 0 && (
				<div>
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
						{shown.map((result) => (
							<div key={result.id} className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
								{result.coverUrl ? (
									<div className={`w-full overflow-hidden ${category === "game" ? "aspect-video" : "aspect-[2/3]"}`}>
										<Image src={result.coverUrl} alt={result.title} width={300} height={category === "game" ? 169 : 450} className="w-full h-full object-cover" />
									</div>
								) : (
									<div className={`flex w-full items-center justify-center bg-zinc-100 text-sm text-zinc-400 dark:bg-zinc-800 ${category === "game" ? "aspect-video" : "aspect-[2/3]"}`}>No image</div>
								)}
								<div className="p-3">
									<p className="text-sm font-medium leading-tight">{result.title}</p>
									{result.subtitle && <p className="mt-1 text-xs text-zinc-500">{result.subtitle}</p>}
									{added.has(result.id) ? (
										<p className="mt-2 text-center text-xs font-medium text-forest-400">✓ Added</p>
									) : (
										<div className="mt-2 flex gap-1">
											{(["backlog", "in_progress", "completed"] as MediaStatus[]).map((status) => (
												<button
													key={status}
													onClick={() => handleAdd(result, status)}
													className="flex-1 rounded-md border border-zinc-200 bg-white px-1 py-1 text-xs font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
													title={status === "in_progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)}
												>
													{status === "backlog" ? "Backlog" : status === "in_progress" ? "Current" : "Done"}
												</button>
											))}
										</div>
									)}
								</div>
							</div>
						))}
					</div>
					<div className="mt-3 flex items-center gap-4">
						{visible.length > 5 && (
							<button onClick={() => setExpanded((e) => !e)} className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
								{expanded ? "Show less" : `Show all ${visible.length} results`}
							</button>
						)}
						<button onClick={handleClose} className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
