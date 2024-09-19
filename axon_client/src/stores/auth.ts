import type { TUser } from "@/types";
import { create } from "zustand";

type AuthUser = Omit<TUser, "password" | "email"> & {
  _id: string;
};

interface IUserStore {
  _id: string;
  username: string;
  userImage: string | undefined;
  mainIcon: string | undefined;
  mainCover: string | undefined;
  setAuthStore: (userObj: Omit<AuthUser, "userImage">) => void;
}

export const useAuthStore = create<IUserStore>((set) => ({
  _id: "",
  username: "",
  userImage: undefined,
  mainIcon: undefined,
  mainCover: undefined,
  setAuthStore: (userObj) =>
    set((state) => ({
      ...state,
      ...userObj,
    })),
}));
