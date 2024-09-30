import type { TResponse, TUser } from "@/types";
import axios, { AxiosError } from "axios";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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
}

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
					const response = await axios.post<TResponse>(
						"http://localhost:3001/api/auth/sign-up",
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
				if (email.trim() === "" || password.trim() === "") {
					set({ isLoading: false, error: "Incomplete details" });
					setTimeout(() => set({ error: null }), 2000);
					return false;
				}

				set({ isLoading: true, error: null });
				try {
					const response = await axios.post<TResponse>(
						"http://localhost:3001/api/auth/sign-in",
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
