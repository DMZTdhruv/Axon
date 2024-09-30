"use client";

import { useAuthStore } from "@/stores/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Auth = () => {
	const { user } = useAuthStore();
	const router = useRouter();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const authUser = localStorage.getItem("axon_user");
		if (!authUser) {
			router.push("/auth/sign-in");
			return;
		}
	}, []);
	return null;
};

export default Auth;
