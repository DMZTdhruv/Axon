import type { TUser } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { signUp } from "../app/api/signUp";

const useSignUp = (credentials: Omit<TUser, "userImage">) => {
	return useQuery({
		queryKey: ["signUp"],
		queryFn: () => {
			return signUp(credentials);
		},
	});
};

export default useSignUp;
