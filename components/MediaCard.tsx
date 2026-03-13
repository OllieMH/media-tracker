"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
	const [notes, setNotes] = useState(item.notes ?? "");
	const [showNotes, setShowNotes] = useState(false);
	const [showDetail, setShowDetail] = useState(false);
	const [saving, setSaving] = useState(false);
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Sync notes if the item is refreshed from outside (e.g. after onUpdate)
	useEffect(() => {
		setNotes(item.notes ?? "");
	}, [item.notes]);

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

	function handleNotesChange(value: string) {
		setNotes(value);
		setSaving(true);
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(async () => {
			await updateMediaItem(item.id, { notes: value });
			setSaving(false);
		}, 800);
	}

	return (
		<>
			<div className="flex gap-3 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
				{item.cover_image_url ? (
					<Image src={item.cover_image_url} alt={item.title} width={100} height={100} className="rounded object-cover flex-shrink-0" />
				) : (
					<div className="flex h-[90px] w-[60px] flex-shrink-0 items-center justify-center rounded bg-zinc-100 text-xs text-zinc-400 dark:bg-zinc-800">No img</div>
				)}
				<div className="flex flex-1 flex-col gap-2 min-w-0">
					<button onClick={() => setShowDetail(true)} className="text-left font-medium leading-tight truncate hover:underline">
						{item.title}
					</button>
					<select
						aria-label="Status"
						value={item.status}
						onChange={(e) => handleStatusChange(e.target.value as MediaStatus)}
						className="w-full rounded border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-800"
					>
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

					<button onClick={() => setShowNotes((v) => !v)} className="self-start text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
						{showNotes ? "Hide notes" : notes ? "Notes ✎" : "Add notes"}
					</button>

					{showNotes && (
						<div className="flex flex-col gap-1">
							<textarea
								value={notes}
								onChange={(e) => handleNotesChange(e.target.value)}
								placeholder="Add your notes..."
								rows={3}
								className="w-full resize-none rounded border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
							/>
							{saving && <span className="text-xs text-zinc-400">Saving...</span>}
						</div>
					)}

					<button onClick={handleDelete} className="self-start text-xs text-zinc-400 hover:text-red-500">
						Remove
					</button>
				</div>
			</div>

			{showDetail && <MediaDetailModal item={{ ...item, notes: notes || null }} onClose={() => setShowDetail(false)} />}
		</>
	);
}
