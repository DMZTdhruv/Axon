import type { TResponse } from "@/types";
import axios, { AxiosError } from "axios";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// The shape of the authentication state
interface AuthState {
	user: { _id: string; username: string } | null;
	isAuthenticated: boolean;
	error: string | null;
	message: string | null;
	isLoading: boolean;
	login: (email: string, password: string) => Promise<boolean>;
	signUp: (
		email: string,
		username: string,
		password: string,
	) => Promise<boolean>;
	logout: () => void;
	setUser:(user: User) => void;
}

interface User {
	_id: string,
	username: string,
}
// The authentication store using Zustand with persistence
export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			isAuthenticated: false,
			error: null,
			message: null,
			isLoading: false,
			signUp: async (email: string, username: string, password: string) => {
				if (
					email.trim() === "" ||
					password.trim() === "" ||
					username.trim() === ""
				) {
					set({ isLoading: false, error: "Incomplete details" });
					setTimeout(() => set({ error: null }), 2000);
					return false;
				}

				set({ isLoading: true, error: null });
				try {
					// Attempt to sign up the user
					const response = await axios.post<TResponse>(
						`${process.env.NEXT_PUBLIC_API_URL}/api/auth/sign-up`,
						{ email, username, password },
						{ withCredentials: true },
					);
					const user = response.data.data;
					set({
						user,
						isAuthenticated: true,
						isLoading: false,
						message: "Signed up successfully",
					});
					return true;
				} catch (error) {
					// Handle errors during sign-up
					if (error instanceof AxiosError) {
						set({
							error: error.response?.data.message || "An error occurred",
							isAuthenticated: false,
							isLoading: false,
						});
						setTimeout(() => set({ error: null }), 5000);
						return false;
					}
					set({
						error: "An unexpected error occurred",
						isAuthenticated: false,
						isLoading: false,
					});
					return false;
				}
			},
			login: async (email: string, password: string) => {
				// Validate input
				if (email.trim() === "" || password.trim() === "") {
					set({ isLoading: false, error: "Incomplete details" });
					setTimeout(() => set({ error: null }), 2000);
					return false;
				}

				set({ isLoading: true, error: null });
				try {
					// Attempt to log in the user
					const response = await axios.post<TResponse>(
						`${process.env.NEXT_PUBLIC_API_URL}/api/auth/sign-in`,
						{ email, password },
						{ withCredentials: true },
					);
					const user = response.data.data;
					set({
						user,
						isAuthenticated: true,
						isLoading: false,
						message: "Logged in successfully",
					});
					return true;
				} catch (error) {
					if (error instanceof AxiosError) {
						set({
							error: error.response?.data.message || "An error occurred",
							isLoading: false,
						});
						setTimeout(() => set({ error: null }), 5000);
						return false;
					}
					set({ error: "An unexpected error occurred", isLoading: false });
					return false;
				}
			},
			logout: () => {
				set({ user: null, isAuthenticated: false, error: null, message: null });
			},
			setUser: (user: User | null) => set({ user }),
		}),
		{
			name: "axon_user",
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				user: state.user,
				isAuthenticated: state.isAuthenticated,
			}),
		},
	),
);
