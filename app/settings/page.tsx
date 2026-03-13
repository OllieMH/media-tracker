"use client";

import { useState } from "react";
import ProtectedPage from "@/components/ProtectedPage";
import { useAuth } from "@/components/AuthProvider";
import { useSettings, FontSize } from "@/components/SettingsProvider";
import { supabase } from "@/lib/supabase";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
			<h2 className="mb-5 text-base font-semibold">{title}</h2>
			{children}
		</div>
	);
}

export default function SettingsPage() {
	const { user } = useAuth();
	const { fontSize, setFontSize } = useSettings();

	// Display name
	const [displayName, setDisplayName] = useState(
		(user?.user_metadata?.display_name as string) ?? "",
	);
	const [nameStatus, setNameStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

	async function saveDisplayName() {
		setNameStatus("saving");
		const { error } = await supabase.auth.updateUser({ data: { display_name: displayName.trim() } });
		setNameStatus(error ? "error" : "saved");
		setTimeout(() => setNameStatus("idle"), 2500);
	}

	// Password
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordStatus, setPasswordStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
	const [passwordError, setPasswordError] = useState("");

	async function savePassword() {
		setPasswordError("");
		if (newPassword.length < 6) {
			setPasswordError("Password must be at least 6 characters.");
			return;
		}
		if (newPassword !== confirmPassword) {
			setPasswordError("Passwords do not match.");
			return;
		}
		setPasswordStatus("saving");
		const { error } = await supabase.auth.updateUser({ password: newPassword });
		if (error) {
			setPasswordError(error.message);
			setPasswordStatus("error");
		} else {
			setPasswordStatus("saved");
			setNewPassword("");
			setConfirmPassword("");
			setTimeout(() => setPasswordStatus("idle"), 2500);
		}
	}

	const fontSizeOptions: { value: FontSize; label: string; preview: string }[] = [
		{ value: "sm", label: "Small", preview: "Aa" },
		{ value: "md", label: "Medium", preview: "Aa" },
		{ value: "lg", label: "Large", preview: "Aa" },
	];

	return (
		<ProtectedPage>
			<div className="mx-auto max-w-xl">
				<h1 className="mb-2 text-2xl font-semibold">Settings</h1>
				<p className="mb-8 text-zinc-500 dark:text-zinc-400">Manage your account and preferences.</p>

				<div className="flex flex-col gap-4">
					{/* Profile */}
					<Section title="Profile">
						<div className="flex flex-col gap-1.5">
							<label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
								Display name
							</label>
							<p className="text-xs text-zinc-400">Shown in the navigation instead of your email.</p>
							<div className="mt-2 flex gap-2">
								<input
									type="text"
									value={displayName}
									onChange={(e) => setDisplayName(e.target.value)}
									placeholder={user?.email ?? ""}
									className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-zinc-500"
								/>
								<button
									onClick={saveDisplayName}
									disabled={nameStatus === "saving"}
									className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
								>
									{nameStatus === "saving" ? "Saving…" : nameStatus === "saved" ? "Saved!" : "Save"}
								</button>
							</div>
							{nameStatus === "error" && (
								<p className="text-xs text-red-500">Something went wrong. Try again.</p>
							)}
						</div>
					</Section>

					{/* Appearance */}
					<Section title="Appearance">
						<p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">Font size</p>
						<div className="flex gap-2">
							{fontSizeOptions.map(({ value, label, preview }) => (
								<button
									key={value}
									onClick={() => setFontSize(value)}
									className={`flex flex-1 flex-col items-center gap-1 rounded-lg border py-3 transition-colors ${
										fontSize === value
											? "border-zinc-100 bg-zinc-100 text-zinc-900"
											: "border-zinc-700 text-zinc-400 hover:border-zinc-600"
									}`}
								>
									<span className={value === "sm" ? "text-xs" : value === "lg" ? "text-lg" : "text-sm"}>
										{preview}
									</span>
									<span className="text-xs">{label}</span>
								</button>
							))}
						</div>
					</Section>

					{/* Security */}
					<Section title="Security">
						<div className="flex flex-col gap-3">
							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
									New password
								</label>
								<input
									type="password"
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									placeholder="New password"
									className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-zinc-500"
								/>
							</div>
							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
									Confirm password
								</label>
								<input
									type="password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									placeholder="Confirm new password"
									className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-zinc-500"
								/>
							</div>
							{passwordError && <p className="text-xs text-red-500">{passwordError}</p>}
							<button
								onClick={savePassword}
								disabled={passwordStatus === "saving" || !newPassword}
								className="self-start rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
							>
								{passwordStatus === "saving"
									? "Saving…"
									: passwordStatus === "saved"
										? "Password updated!"
										: "Update password"}
							</button>
						</div>
					</Section>
				</div>
			</div>
		</ProtectedPage>
	);
}
