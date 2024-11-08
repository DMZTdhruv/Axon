import type { TResponse, TUser } from "@/types";
import axios, { AxiosError } from "axios";

interface ISendUserDataSignUp {
	email: string;
	username: string;
	password: string;
}

// Custom hook for sign up functionality
const useSign = () => {
	// Sends sign up data to the backend
	const sendSignUpData = async ({
		email,
		password,
		username,
	}: ISendUserDataSignUp) => {
		const signUpData: Omit<TUser, "userImage"> = { email, username, password };

		try {
			// Post request to the sign up endpoint with data and credentials
			const { data } = await axios.post<TResponse>(
				`${process.env.NEXT_PUBLIC_API_URL}/api/auth/sign-up`,
				signUpData,
				{
					withCredentials: true,
				},
			);

			return data; // Returns response data on success
		} catch (error) {
			// Handle Axios errors
			if (error instanceof AxiosError) {
				throw new Error(error.message);
			}
		}
	};

	return { sendSignUpData }; // Exposes the sig nup function
};

export default useSign;
