"use client";

import { useAuthStore } from "@/stores/auth";
import type { TAuthUser } from "@/types";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Auth = () => {
	const { setAuthStore, username, _id } = useAuthStore();
	const router = useRouter();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const authUser = localStorage.getItem("axon_user");
		if (!authUser) {
			router.push("/auth/sign-in");
			return;
		}
		const user = JSON.parse(authUser) as TAuthUser;
		setAuthStore({ username: user.username, _id: user._id });
		console.log({
			username,
			_id,
		});
	}, []);
	return null;
};

export default Auth;
