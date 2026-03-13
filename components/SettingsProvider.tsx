"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type FontSize = "sm" | "md" | "lg";

interface SettingsContextType {
	fontSize: FontSize;
	setFontSize: (f: FontSize) => void;
}

const SettingsContext = createContext<SettingsContextType>({
	fontSize: "md",
	setFontSize: () => {},
});

export function useSettings() {
	return useContext(SettingsContext);
}

function applyFontSize(size: FontSize) {
	const root = document.documentElement;
	if (size === "sm") root.style.fontSize = "14px";
	else if (size === "lg") root.style.fontSize = "18px";
	else root.style.removeProperty("font-size");
}

export default function SettingsProvider({ children }: { children: React.ReactNode }) {
	const [fontSize, setFontSizeState] = useState<FontSize>("md");

	useEffect(() => {
		const saved = (localStorage.getItem("fontSize") as FontSize) ?? "md";
		setFontSizeState(saved);
		applyFontSize(saved);
	}, []);

	function setFontSize(f: FontSize) {
		setFontSizeState(f);
		localStorage.setItem("fontSize", f);
		applyFontSize(f);
	}

	return (
		<SettingsContext.Provider value={{ fontSize, setFontSize }}>
			{children}
		</SettingsContext.Provider>
	);
}
