"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { MediaItem, MediaStatus } from "@/types/media";
import { updateMediaItem, deleteMediaItem } from "@/lib/mediaService";

interface Props {
	item: MediaItem;
	onClose: () => void;
	onUpdate: () => void;
}

function formatKey(key: string): string {
	return key
		.replace(/_/g, " ")
		.replace(/([a-z])([A-Z])/g, "$1 $2")
		.replace(/\b\w/g, (c) => c.toUpperCase());
}

const HIDDEN_KEYS = new Set(["poster_path", "backdrop_path", "genre_ids", "id", "adult", "video", "original_language"]);

const statusLabels: Record<MediaStatus, string> = {
	backlog: "Backlog",
	in_progress: "In Progress",
	completed: "Completed",
};

export default function MediaDetailModal({ item, onClose, onUpdate }: Props) {
	const [notes, setNotes] = useState(item.notes ?? "");
	const [saving, setSaving] = useState(false);
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const metadataEntries = item.metadata
		? Object.entries(item.metadata).filter(
				([key, value]) => !HIDDEN_KEYS.has(key) && value !== null && value !== undefined && value !== "",
			)
		: [];

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
		onClose();
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

	const isGame = item.category === "game";

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

				<div className="flex flex-col gap-4 sm:flex-row">
					{item.cover_image_url ? (
						<Image
							src={item.cover_image_url}
							alt={item.title}
							width={isGame ? 240 : 100}
							height={isGame ? 135 : 150}
							className="rounded object-cover flex-shrink-0"
						/>
					) : (
						<div className={`flex flex-shrink-0 items-center justify-center rounded bg-zinc-100 text-xs text-zinc-400 dark:bg-zinc-800 ${isGame ? "w-[240px] h-[135px]" : "w-[100px] h-[150px]"}`}>
							No image
						</div>
					)}
					<div className="flex flex-col gap-3 min-w-0 flex-1">
						<h2 className="text-lg font-semibold leading-tight pr-6">{item.title}</h2>
						<span className="w-fit rounded-full bg-zinc-100 px-2 py-0.5 text-xs capitalize text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
							{item.category}
						</span>

						<select
							aria-label="Status"
							value={item.status}
							onChange={(e) => handleStatusChange(e.target.value as MediaStatus)}
							className="rounded border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800"
						>
							{Object.entries(statusLabels).map(([value, label]) => (
								<option key={value} value={value}>{label}</option>
							))}
						</select>

						<div className="flex items-center gap-0.5">
							{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
								<button
									key={n}
									onClick={() => handleRatingChange(n)}
									className={`text-base ${item.rating && n <= item.rating ? "text-amber-400" : "text-zinc-300 dark:text-zinc-600"}`}
								>
									★
								</button>
							))}
						</div>
					</div>
				</div>

				<div className="mt-5">
					<h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">Notes</h3>
					<textarea
						value={notes}
						onChange={(e) => handleNotesChange(e.target.value)}
						placeholder="Add your notes..."
						rows={3}
						className="w-full resize-none rounded border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
					/>
					{saving && <span className="text-xs text-zinc-400">Saving...</span>}
				</div>

				{metadataEntries.length > 0 && (
					<div className="mt-5">
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

				<button
					onClick={handleDelete}
					className="mt-6 text-xs text-zinc-400 hover:text-red-500 transition-colors"
				>
					Remove from list
				</button>
			</div>
		</div>
	);
}
