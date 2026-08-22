"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { isGuestMode, setGuestMode } from "@/lib/guestMode";

interface AuthContextType {
	user: User | null;
	loading: boolean;
	isGuest: boolean;
	continueAsGuest: () => void;
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	loading: true,
	isGuest: false,
	continueAsGuest: () => {},
	signOut: async () => {},
});

export function useAuth() {
	return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [isGuest, setIsGuest] = useState(isGuestMode);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setUser(session?.user ?? null);
			if (session?.user) {
				setGuestMode(false);
				setIsGuest(false);
			}
			setLoading(false);
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null);
			if (session?.user) {
				setGuestMode(false);
				setIsGuest(false);
			}
		});

		return () => subscription.unsubscribe();
	}, []);

	function continueAsGuest() {
		setGuestMode(true);
		setIsGuest(true);
	}

	async function signOut() {
		if (isGuest) {
			setGuestMode(false);
			setIsGuest(false);
			return;
		}
		await supabase.auth.signOut();
	}

	return (
		<AuthContext.Provider value={{ user, loading, isGuest, continueAsGuest, signOut }}>
			{children}
		</AuthContext.Provider>
	);
}
