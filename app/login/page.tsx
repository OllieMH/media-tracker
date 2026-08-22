"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
	const router = useRouter();
	const { continueAsGuest } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);

		const { error } = await supabase.auth.signInWithPassword({ email, password });

		if (error) {
			setError(error.message);
			setLoading(false);
		} else {
			router.push("/");
		}
	}

	return (
		<div className="mx-auto max-w-sm pt-16">
			<h1 className="mb-8 text-2xl font-bold">Sign in</h1>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<div>
					<label htmlFor="email" className="mb-1 block text-sm font-medium">
						Email
					</label>
					<input
						id="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="w-full rounded border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-forest-500 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-forest-500"
					/>
				</div>
				<div>
					<label htmlFor="password" className="mb-1 block text-sm font-medium">
						Password
					</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						className="w-full rounded border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-forest-500 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-forest-500"
					/>
				</div>
				{error && <p className="text-sm text-red-500">{error}</p>}
				<button
					type="submit"
					disabled={loading}
					className="rounded bg-forest-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-forest-500 disabled:opacity-50"
				>
					{loading ? "Signing in…" : "Sign in"}
				</button>
			</form>
			<p className="mt-4 text-sm text-zinc-500">
				No account?{" "}
				<Link href="/signup" className="underline hover:text-zinc-900 dark:hover:text-zinc-100">
					Sign up
				</Link>
			</p>

			<div className="mt-6 border-t border-zinc-200 pt-6 dark:border-zinc-800">
				<button
					type="button"
					onClick={() => {
						continueAsGuest();
						router.push("/");
					}}
					className="w-full rounded border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
				>
					Continue as guest
				</button>
				<p className="mt-2 text-xs text-zinc-500">
					No account needed — your data is saved only in this browser and won&apos;t sync across devices.
				</p>
			</div>
		</div>
	);
}
