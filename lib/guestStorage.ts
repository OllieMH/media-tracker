import { MediaItem, NewMediaItem } from "@/types/media";

const ITEMS_KEY = "mediaTracker.guestItems";

function readAll(): MediaItem[] {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(ITEMS_KEY);
		return raw ? (JSON.parse(raw) as MediaItem[]) : [];
	} catch {
		return [];
	}
}

function writeAll(items: MediaItem[]) {
	localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
}

export async function guestAddMediaItem(item: NewMediaItem): Promise<MediaItem> {
	const now = new Date().toISOString();
	const newItem: MediaItem = {
		...item,
		id: crypto.randomUUID(),
		user_id: "guest",
		created_at: now,
		updated_at: now,
	};
	writeAll([newItem, ...readAll()]);
	return newItem;
}

export async function guestGetMediaItems(category?: string): Promise<MediaItem[]> {
	const items = readAll();
	return category ? items.filter((i) => i.category === category) : items;
}

export async function guestUpdateMediaItem(
	id: string,
	updates: Partial<Pick<MediaItem, "status" | "rating" | "notes" | "metadata" | "is_favorite">>
): Promise<void> {
	const items = readAll();
	const idx = items.findIndex((i) => i.id === id);
	if (idx === -1) throw new Error("Item not found");
	items[idx] = { ...items[idx], ...updates, updated_at: new Date().toISOString() };
	writeAll(items);
}

export async function guestDeleteMediaItem(id: string): Promise<void> {
	writeAll(readAll().filter((i) => i.id !== id));
}

export function clearGuestItems() {
	if (typeof window === "undefined") return;
	localStorage.removeItem(ITEMS_KEY);
}
