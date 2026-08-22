"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function ProtectedPage({ children }: { children: React.ReactNode }) {
	const { user, loading, isGuest } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading && !user && !isGuest) {
			router.push("/login");
		}
	}, [user, loading, isGuest, router]);

	if (loading) return <p className="text-sm text-zinc-500">Loading…</p>;
	if (!user && !isGuest) return null;

	return <>{children}</>;
}
