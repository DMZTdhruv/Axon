import axios from "axios";

const logout = async (): Promise<boolean> => {
	try {
		await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/sign-out`, {
			withCredentials: true,
		});
		console.log(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/sign-out`);
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
};

const useLogout = () => {
	return {
		logout,
	};
};

export default useLogout;
