"use client";

import useLogout from "@/hooks/use-logout";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const Auth = () => {
	const router = useRouter();
	const pathName = usePathname();
	const { logout } = useLogout();
	const handleLogout = async () => {
		const authUser = localStorage.getItem("axon_user");
		if (!authUser) {
			const res = await logout();
			if (res) {
				router.push("/auth/sign-in");
			}
		}
	};
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		handleLogout();
	}, [pathName]);
	return null;
};

export default Auth;
