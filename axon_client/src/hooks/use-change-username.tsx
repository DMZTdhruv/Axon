import { AxonError } from "@/types";
import axios from "axios";

const changeUsername = async (
	newUsername: string,
): Promise<{ status: "error" | "success"; message: string }> => {
	try {
		const response = await axios.post(
			`${process.env.NEXT_PUBLIC_API_URL}/api/auth/change-username`,
			{ username: newUsername },
			{ withCredentials: true },
		);

		const { data } = response;
		return {
			status: data.status,
			message: data.message,
		};
	} catch (error) {
		const axiosError = error as AxonError;
		return {
			status: "error",
			message: axiosError.response?.data.message || axiosError.message,
		};
	}
};

const useChangeUsername = () => {
	return {
		changeUsername,
	};
};

export default useChangeUsername;
