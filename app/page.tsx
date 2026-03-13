"use client";

import Link from "next/link";
import ProtectedPage from "@/components/ProtectedPage";

const categories = [
	{ href: "/movies", label: "Movies", emoji: "🎬" },
	{ href: "/series", label: "Series", emoji: "📺" },
	{ href: "/books", label: "Books", emoji: "📚" },
	{ href: "/games", label: "Games", emoji: "🎮" },
];

export default function HomePage() {
	return (
		<ProtectedPage>
			<div>
				<h1 className="mb-2 text-2xl font-semibold">Dashboard</h1>
				<p className="mb-8 text-zinc-500 dark:text-zinc-400">Track your media backlog across all categories.</p>
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
					{categories.map(({ href, label, emoji }) => (
						<Link
							key={href}
							href={href}
							className="flex flex-col items-center gap-3 rounded-xl border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
						>
							<span className="text-4xl">{emoji}</span>
							<span className="font-medium">{label}</span>
						</Link>
					))}
				</div>
			</div>
		</ProtectedPage>
	);
}
