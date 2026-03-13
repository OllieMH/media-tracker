"use client";

import Image from "next/image";
import { MediaItem } from "@/types/media";

interface Props {
	item: MediaItem;
	onClose: () => void;
}

function formatKey(key: string): string {
	return key
		.replace(/_/g, " ")
		.replace(/([a-z])([A-Z])/g, "$1 $2")
		.replace(/\b\w/g, (c) => c.toUpperCase());
}

const HIDDEN_KEYS = new Set(["poster_path", "backdrop_path", "genre_ids", "id", "adult", "video", "original_language"]);

export default function MediaDetailModal({ item, onClose }: Props) {
	const metadataEntries = item.metadata
		? Object.entries(item.metadata).filter(
				([key, value]) => !HIDDEN_KEYS.has(key) && value !== null && value !== undefined && value !== "",
			)
		: [];

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
			<div
				className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900"
				onClick={(e) => e.stopPropagation()}
			>
				<button
					onClick={onClose}
					className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
					aria-label="Close"
				>
					✕
				</button>

				<div className="flex gap-4">
					{item.cover_image_url ? (
						<Image src={item.cover_image_url} alt={item.title} width={100} height={150} className="rounded object-cover flex-shrink-0" />
					) : (
						<div className="flex h-[150px] w-[100px] flex-shrink-0 items-center justify-center rounded bg-zinc-100 text-xs text-zinc-400 dark:bg-zinc-800">
							No image
						</div>
					)}
					<div className="flex flex-col gap-2 min-w-0">
						<h2 className="text-lg font-semibold leading-tight">{item.title}</h2>
						<span className="w-fit rounded-full bg-zinc-100 px-2 py-0.5 text-xs capitalize text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
							{item.category}
						</span>
						<p className="text-sm text-zinc-500">
							Status:{" "}
							<span className="capitalize text-zinc-700 dark:text-zinc-300">
								{item.status.replace("_", " ")}
							</span>
						</p>
						{item.rating && (
							<p className="text-sm text-zinc-500">
								Rating:{" "}
								<span className="text-amber-500">
									{"★".repeat(item.rating)}
									<span className="text-zinc-300 dark:text-zinc-600">{"★".repeat(10 - item.rating)}</span>
								</span>{" "}
								<span className="text-zinc-700 dark:text-zinc-300">({item.rating}/10)</span>
							</p>
						)}
					</div>
				</div>

				{metadataEntries.length > 0 && (
					<div className="mt-6">
						<h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">Details</h3>
						<dl className="space-y-2">
							{metadataEntries.map(([key, value]) => (
								<div key={key} className="flex flex-col gap-0.5">
									<dt className="text-xs font-medium text-zinc-400">{formatKey(key)}</dt>
									<dd className="text-sm text-zinc-700 dark:text-zinc-300">
										{Array.isArray(value)
											? value.join(", ")
											: typeof value === "object"
												? JSON.stringify(value)
												: String(value)}
									</dd>
								</div>
							))}
						</dl>
					</div>
				)}

				{item.notes && (
					<div className="mt-6">
						<h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">Notes</h3>
						<p className="whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">{item.notes}</p>
					</div>
				)}
			</div>
		</div>
	);
}
