import type { TUser } from "@/types";

export const signUp = async (credentials: Omit<TUser, "userImage">) => {
	try {
		const response = await fetch("http://localhost:3001/api/auth/sign-up", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(credentials),
		});

		if (!response.ok) {
			throw new Error("Sign-in failed");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		throw new Error("Sign-in failed");
	}
};
