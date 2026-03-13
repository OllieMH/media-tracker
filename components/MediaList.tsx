"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MediaCategory, MediaItem, MediaStatus } from "@/types/media";
import { getMediaItems } from "@/lib/mediaService";
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
	const [statusFilter, setStatusFilter] = useState<MediaStatus | "all">("all");
	const [sort, setSort] = useState<SortOption>("newest");
	const [tick, setTick] = useState(0);

	const triggerRefresh = useCallback(() => setTick((t) => t + 1), []);

	useEffect(() => {
		async function fetchData() {
			setLoading(true);
			const data = await getMediaItems(category);
			setItems(data);
			setLoading(false);
		}
		fetchData();
	}, [category, refreshKey, tick]);

	const sorted = useMemo(() => sortItems(items, sort), [items, sort]);

	const groups = useMemo(() => {
		if (statusFilter !== "all") {
			return [{ key: statusFilter, label: statusGroups.find((g) => g.key === statusFilter)!.label, items: sorted.filter((i) => i.status === statusFilter) }];
		}
		return statusGroups.map(({ key, label }) => ({
			key,
			label,
			items: sorted.filter((i) => i.status === key),
		}));
	}, [sorted, statusFilter]);

	if (loading) {
		return (
			<div className="space-y-6">
				{statusGroups.map(({ key, label }) => (
					<div key={key}>
						<div className="mb-3 h-4 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
							{[1, 2, 3].map((n) => (
								<MediaCardSkeleton key={n} />
							))}
						</div>
					</div>
				))}
			</div>
		);
	}
	if (items.length === 0) return <p className="text-sm text-zinc-500">Nothing saved yet.</p>;

	return (
		<div>
			<div className="mb-6 flex flex-wrap gap-3">
				<select
					aria-label="Filter by status"
					value={statusFilter}
					onChange={(e) => setStatusFilter(e.target.value as MediaStatus | "all")}
					className="rounded border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800"
				>
					<option value="all">All statuses</option>
					<option value="in_progress">In Progress</option>
					<option value="backlog">Backlog</option>
					<option value="completed">Completed</option>
				</select>

				<select aria-label="Sort by" value={sort} onChange={(e) => setSort(e.target.value as SortOption)} className="rounded border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800">
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
							<h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">{label}</h3>
							<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
								{groupItems.map((item) => (
									<MediaCard key={item.id} item={item} onUpdate={triggerRefresh} />
								))}
							</div>
						</div>
					),
				)}
			</div>
		</div>
	);
}
