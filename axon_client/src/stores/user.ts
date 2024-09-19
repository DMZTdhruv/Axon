import type { TUser } from "@/types";
import { create } from "zustand";

interface IUserStore {
	username: string;
	email: string;
	userImage: string;
	password: string;
	setUserStore: (userObj: Omit<TUser, "userImage">) => void;
}

export const useUserStore = create<IUserStore>((set) => ({
	email: "",
	username: "",
	userImage: "",
	password: "",
	setUserStore: (userObj) =>
		set((state) => ({
			...state,
			...userObj,
		})),
}));
