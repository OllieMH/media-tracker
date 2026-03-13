"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedPage from "@/components/ProtectedPage";
import { getMediaItems } from "@/lib/mediaService";
import { MediaItem, MediaCategory } from "@/types/media";

const categories: { href: string; label: string; emoji: string; category: MediaCategory }[] = [
	{ href: "/movies", label: "Movies", emoji: "🎬", category: "movie" },
	{ href: "/series", label: "Series", emoji: "📺", category: "series" },
	{ href: "/books", label: "Books", emoji: "📚", category: "book" },
	{ href: "/games", label: "Games", emoji: "🎮", category: "game" },
];

const categoryRoute: Record<MediaCategory, string> = {
	movie: "/movies",
	series: "/series",
	book: "/books",
	game: "/games",
};

const categoryLabel: Record<MediaCategory, string> = {
	movie: "Movie",
	series: "Series",
	book: "Book",
	game: "Game",
};

const statusLabel: Record<string, string> = {
	completed: "Completed",
	in_progress: "In Progress",
	backlog: "Backlog",
};

function StatCard({ label, value }: { label: string; value: string | number }) {
	return (
		<div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
			<p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
			<p className="mt-1 text-3xl font-semibold">{value}</p>
		</div>
	);
}

function StatCardSkeleton() {
	return (
		<div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
			<div className="h-4 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
			<div className="mt-2 h-8 w-16 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
		</div>
	);
}

export default function HomePage() {
	const [items, setItems] = useState<MediaItem[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getMediaItems()
			.then(setItems)
			.catch(() => {})
			.finally(() => setLoading(false));
	}, []);

	const total = items.length;
	const completed = items.filter((i) => i.status === "completed").length;
	const inProgress = items.filter((i) => i.status === "in_progress").length;
	const rated = items.filter((i) => i.rating !== null);
	const avgRating =
		rated.length > 0
			? (rated.reduce((sum, i) => sum + (i.rating ?? 0), 0) / rated.length).toFixed(1)
			: "—";

	const countsByCategory = (category: MediaCategory) => {
		const cat = items.filter((i) => i.category === category);
		return {
			total: cat.length,
			completed: cat.filter((i) => i.status === "completed").length,
			inProgress: cat.filter((i) => i.status === "in_progress").length,
			backlog: cat.filter((i) => i.status === "backlog").length,
		};
	};

	const recent = items.slice(0, 5);

	return (
		<ProtectedPage>
			<div>
				<h1 className="mb-2 text-2xl font-semibold">Dashboard</h1>
				<p className="mb-8 text-zinc-500 dark:text-zinc-400">Track your media backlog across all categories.</p>

				{/* Summary stats */}
				<div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
					{loading ? (
						Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
					) : (
						<>
							<StatCard label="Total tracked" value={total} />
							<StatCard label="Completed" value={completed} />
							<StatCard label="In progress" value={inProgress} />
							<StatCard label="Avg rating" value={avgRating} />
						</>
					)}
				</div>

				{/* Category cards */}
				<h2 className="mb-4 text-lg font-medium">Categories</h2>
				<div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
					{categories.map(({ href, label, emoji, category }) => {
						const counts = countsByCategory(category);
						return (
							<Link
								key={href}
								href={href}
								className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
							>
								<div className="flex items-center gap-2">
									<span className="text-2xl">{emoji}</span>
									<span className="font-medium">{label}</span>
								</div>
								{loading ? (
									<div className="h-4 w-20 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
								) : counts.total === 0 ? (
									<p className="text-sm text-zinc-400">Nothing tracked yet</p>
								) : (
									<div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
										<span>{counts.total} total</span>
										{counts.completed > 0 && (
											<span className="text-green-600 dark:text-green-400">{counts.completed} done</span>
										)}
										{counts.inProgress > 0 && (
											<span className="text-blue-600 dark:text-blue-400">{counts.inProgress} active</span>
										)}
										{counts.backlog > 0 && <span>{counts.backlog} backlog</span>}
									</div>
								)}
							</Link>
						);
					})}
				</div>

				{/* Recently added */}
				{(loading || recent.length > 0) && (
					<>
						<h2 className="mb-4 text-lg font-medium">Recently added</h2>
						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
							{loading
								? Array.from({ length: 5 }).map((_, i) => (
										<div
											key={i}
											className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900"
										>
											<div className="h-14 w-10 shrink-0 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
											<div className="flex-1 space-y-2">
												<div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
												<div className="h-3 w-16 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
											</div>
										</div>
									))
								: recent.map((item) => (
										<Link
											key={item.id}
											href={categoryRoute[item.category]}
											className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
										>
											{item.cover_image_url ? (
												<img
													src={item.cover_image_url}
													alt={item.title}
													className="h-14 w-10 shrink-0 rounded object-cover"
												/>
											) : (
												<div className="flex h-14 w-10 shrink-0 items-center justify-center rounded bg-zinc-100 text-xl dark:bg-zinc-800">
													{categories.find((c) => c.category === item.category)?.emoji}
												</div>
											)}
											<div className="min-w-0">
												<p className="truncate text-sm font-medium">{item.title}</p>
												<p className="text-xs text-zinc-400">{categoryLabel[item.category]}</p>
												<span
													className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
														item.status === "completed"
															? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
															: item.status === "in_progress"
																? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
																: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
													}`}
												>
													{statusLabel[item.status]}
												</span>
											</div>
										</Link>
									))}
						</div>
					</>
				)}
			</div>
		</ProtectedPage>
	);
}
