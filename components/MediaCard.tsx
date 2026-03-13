"use client";

import Image from "next/image";
import { useState } from "react";
import { MediaItem, MediaStatus } from "@/types/media";
import { updateMediaItem, deleteMediaItem } from "@/lib/mediaService";
import MediaDetailModal from "./MediaDetailModal";

const statusLabels: Record<MediaStatus, string> = {
	backlog: "Backlog",
	in_progress: "In Progress",
	completed: "Completed",
};

interface Props {
	item: MediaItem;
	onUpdate: () => void;
}

export default function MediaCard({ item, onUpdate }: Props) {
	const [showDetail, setShowDetail] = useState(false);

	async function handleStatusChange(status: MediaStatus) {
		await updateMediaItem(item.id, { status });
		onUpdate();
	}

	async function handleRatingChange(rating: number) {
		await updateMediaItem(item.id, { rating });
		onUpdate();
	}

	async function handleDelete() {
		await deleteMediaItem(item.id);
		onUpdate();
	}

	const isGame = item.category === "game";

	return (
		<>
			<div
				className={`relative group overflow-hidden rounded-lg cursor-pointer bg-zinc-100 dark:bg-zinc-800 ${isGame ? "aspect-video" : "aspect-[2/3]"}`}
				onClick={() => setShowDetail(true)}
			>
				{item.cover_image_url ? (
					<Image
						src={item.cover_image_url}
						alt={item.title}
						fill
						className="object-cover"
						sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
					/>
				) : (
					<div className="flex h-full items-center justify-center text-xs text-zinc-400">No image</div>
				)}

				{/* Permanent bottom gradient + title */}
				<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 pt-12 pointer-events-none">
					<p className="text-sm font-medium text-white leading-tight line-clamp-2">{item.title}</p>
				</div>

				{/* Hover overlay */}
				<div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3">
					<div className="flex items-start justify-between gap-2">
						<p className="text-sm font-semibold text-white leading-tight line-clamp-3">{item.title}</p>
						<button
							onClick={(e) => { e.stopPropagation(); handleDelete(); }}
							className="flex-shrink-0 text-zinc-400 hover:text-red-400 transition-colors"
							aria-label="Remove"
						>
							✕
						</button>
					</div>

					<div className="flex flex-col gap-2">
						<div className="flex gap-0.5">
							{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
								<button
									key={n}
									onClick={(e) => { e.stopPropagation(); handleRatingChange(n); }}
									className={`text-xs leading-none ${item.rating && n <= item.rating ? "text-amber-400" : "text-zinc-600 hover:text-zinc-400"}`}
								>
									★
								</button>
							))}
						</div>
						<select
							aria-label="Status"
							value={item.status}
							onClick={(e) => e.stopPropagation()}
							onChange={(e) => { e.stopPropagation(); handleStatusChange(e.target.value as MediaStatus); }}
							className="w-full rounded border border-zinc-600 bg-zinc-900/80 px-2 py-1 text-xs text-white"
						>
							{Object.entries(statusLabels).map(([value, label]) => (
								<option key={value} value={value}>{label}</option>
							))}
						</select>
					</div>
				</div>
			</div>

			{showDetail && (
				<MediaDetailModal item={item} onClose={() => setShowDetail(false)} onUpdate={onUpdate} />
			)}
		</>
	);
}
