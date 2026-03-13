"use client";

import Image from "next/image";
import { MediaItem, MediaStatus } from "@/types/media";
import { updateMediaItem, deleteMediaItem } from "@/lib/mediaService";

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

	return (
		<div className="flex gap-3 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
			{item.cover_image_url ? (
				<Image src={item.cover_image_url} alt={item.title} width={60} height={90} className="rounded object-cover flex-shrink-0" />
			) : (
				<div className="flex h-[90px] w-[60px] flex-shrink-0 items-center justify-center rounded bg-zinc-100 text-xs text-zinc-400 dark:bg-zinc-800">No img</div>
			)}
			<div className="flex flex-1 flex-col gap-2 min-w-0">
				<p className="font-medium leading-tight truncate">{item.title}</p>
				<select aria-label="Status" value={item.status} onChange={(e) => handleStatusChange(e.target.value as MediaStatus)} className="w-full rounded border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-800">
					{Object.entries(statusLabels).map(([value, label]) => (
						<option key={value} value={value}>
							{label}
						</option>
					))}
				</select>
				<div className="flex items-center gap-1">
					{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
						<button key={n} onClick={() => handleRatingChange(n)} className={`text-xs ${item.rating && n <= item.rating ? "text-amber-400" : "text-zinc-300 dark:text-zinc-600"}`}>
							★
						</button>
					))}
				</div>
				<button onClick={handleDelete} className="self-start text-xs text-zinc-400 hover:text-red-500">
					Remove
				</button>
			</div>
		</div>
	);
}
