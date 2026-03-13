"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MediaCategory, MediaItem, MediaStatus } from "@/types/media";
import { getMediaItems, updateMediaItem } from "@/lib/mediaService";
import { fetchGenres } from "@/lib/apiClients/tmdb";
import MediaCard from "./MediaCard";
import { MediaCardSkeleton } from "./SkeletonCards";

type SortOption = "newest" | "oldest" | "title" | "rating_high" | "rating_low";

interface Props {
	category: MediaCategory;
	refreshKey: number;
}

const statusGroups: { key: MediaStatus; label: string }[] = [
	{ key: "in_progress", label: "In Progress" },
	{ key: "backlog", label: "Backlog" },
	{ key: "completed", label: "Completed" },
];

function sortItems(items: MediaItem[], sort: SortOption): MediaItem[] {
	return [...items].sort((a, b) => {
		switch (sort) {
			case "newest":
				return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
			case "oldest":
				return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
			case "title":
				return a.title.localeCompare(b.title);
			case "rating_high":
				return (b.rating ?? 0) - (a.rating ?? 0);
			case "rating_low":
				return (a.rating ?? 11) - (b.rating ?? 11);
		}
	});
}

export default function MediaList({ category, refreshKey }: Props) {
	const [items, setItems] = useState<MediaItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [sort, setSort] = useState<SortOption>("newest");
	const [collapsed, setCollapsed] = useState<Set<MediaStatus>>(new Set());
	const [genreFilter, setGenreFilter] = useState<string | null>(null);
	const [tick, setTick] = useState(0);

	const triggerRefresh = useCallback(() => setTick((t) => t + 1), []);

	useEffect(() => {
		async function fetchData() {
			setLoading(true);
			setError(null);
			try {
				const data = await getMediaItems(category);

				if (category === "movie" || category === "series") {
					const type = category === "movie" ? "movie" : "tv";
					const missing = data.filter(
						(i) => i.api_id && !Array.isArray(i.metadata?.genres)
					);
					if (missing.length > 0) {
						await Promise.all(
							missing.map(async (item) => {
								try {
									const genres = await fetchGenres(item.api_id!, type);
									await updateMediaItem(item.id, {
										metadata: { ...item.metadata, genres },
									});
									item.metadata = { ...item.metadata, genres };
								} catch {
									// silently skip if fetch fails for an individual item
								}
							})
						);
					}
				}

				setItems(data);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to load items.");
			} finally {
				setLoading(false);
			}
		}
		fetchData();
	}, [category, refreshKey, tick]);

	const availableGenres = useMemo(() => {
		if (category !== "movie" && category !== "series") return []
		const set = new Set<string>()
		for (const item of items) {
			const genres = item.metadata?.genres
			if (Array.isArray(genres)) genres.forEach((g: string) => set.add(g))
		}
		return Array.from(set).sort()
	}, [items, category])

	const sorted = useMemo(() => sortItems(items, sort), [items, sort]);

	const filtered = useMemo(() =>
		genreFilter ? sorted.filter((i) => (i.metadata?.genres as string[] | undefined)?.includes(genreFilter)) : sorted,
	[sorted, genreFilter])

	const groups = useMemo(() =>
		statusGroups.map(({ key, label }) => ({
			key,
			label,
			items: filtered.filter((i) => i.status === key),
		})),
	[filtered]);

	function toggleCollapse(key: MediaStatus) {
		setCollapsed((prev) => {
			const next = new Set(prev);
			next.has(key) ? next.delete(key) : next.add(key);
			return next;
		});
	}

	const gridClass = category === "game"
		? "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
		: "grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6";

	if (loading) {
		return (
			<div className="space-y-6">
				{statusGroups.map(({ key, label }) => (
					<div key={key}>
						<div className="mb-3 h-4 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
						<div className={gridClass}>
							{[1, 2, 3].map((n) => (
								<MediaCardSkeleton key={n} />
							))}
						</div>
					</div>
				))}
			</div>
		);
	}

	if (error) {
		return (
			<div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
				<p className="text-sm font-medium text-red-700 dark:text-red-400">Failed to load your list</p>
				<p className="mt-1 text-xs text-red-600 opacity-75 dark:text-red-500">{error}</p>
				<button
					onClick={triggerRefresh}
					className="mt-2 text-xs text-red-700 underline hover:no-underline dark:text-red-400"
				>
					Try again
				</button>
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-700">
				<p className="text-sm font-medium text-zinc-500">Nothing here yet</p>
				<p className="mt-1 text-xs text-zinc-400">Search above to add your first {category}</p>
			</div>
		);
	}

	return (
		<div>
			<div className="mb-6 flex items-start justify-between gap-4">
				{availableGenres.length > 0 ? (
					<div className="flex flex-wrap gap-1.5">
						{availableGenres.map((genre) => (
							<button
								key={genre}
								onClick={() => setGenreFilter(genreFilter === genre ? null : genre)}
								className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
									genreFilter === genre
										? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
										: "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-500"
								}`}
							>
								{genre}
							</button>
						))}
					</div>
				) : <div />}
				<select aria-label="Sort by" value={sort} onChange={(e) => setSort(e.target.value as SortOption)} className="shrink-0 rounded border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800">
					<option value="newest">Newest first</option>
					<option value="oldest">Oldest first</option>
					<option value="title">Title (A–Z)</option>
					<option value="rating_high">Rating (high → low)</option>
					<option value="rating_low">Rating (low → high)</option>
				</select>
			</div>

			<div className="space-y-6">
				{groups.map(({ key, label, items: groupItems }) =>
					groupItems.length === 0 ? null : (
						<div key={key}>
							<button
								onClick={() => toggleCollapse(key)}
								className="mb-3 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
							>
								<span>{collapsed.has(key) ? "▶" : "▼"}</span>
								{label}
								<span className="ml-1 text-xs font-normal normal-case tracking-normal">({groupItems.length})</span>
							</button>
							{!collapsed.has(key) && (
								<div className={gridClass}>
									{groupItems.map((item) => (
										<MediaCard key={item.id} item={item} onUpdate={triggerRefresh} />
									))}
								</div>
							)}
						</div>
					),
				)}
			</div>
		</div>
	);
}
