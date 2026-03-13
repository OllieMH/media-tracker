"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);

		const { error } = await supabase.auth.signUp({ email, password });

		if (error) {
			setError(error.message);
			setLoading(false);
		} else {
			router.push("/");
		}
	}

	return (
		<div className="mx-auto max-w-sm pt-16">
			<h1 className="mb-8 text-2xl font-bold">Create account</h1>
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
						className="w-full rounded border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
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
						minLength={6}
						className="w-full rounded border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
					/>
				</div>
				{error && <p className="text-sm text-red-500">{error}</p>}
				<button
					type="submit"
					disabled={loading}
					className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
				>
					{loading ? "Creating account…" : "Create account"}
				</button>
			</form>
			<p className="mt-4 text-sm text-zinc-500">
				Already have an account?{" "}
				<Link href="/login" className="underline hover:text-zinc-900 dark:hover:text-zinc-100">
					Sign in
				</Link>
			</p>
		</div>
	);
}
