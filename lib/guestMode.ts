const GUEST_MODE_KEY = "mediaTracker.guestMode";

export function isGuestMode(): boolean {
	if (typeof window === "undefined") return false;
	return localStorage.getItem(GUEST_MODE_KEY) === "true";
}

export function setGuestMode(value: boolean) {
	if (typeof window === "undefined") return;
	if (value) {
		localStorage.setItem(GUEST_MODE_KEY, "true");
	} else {
		localStorage.removeItem(GUEST_MODE_KEY);
	}
}
