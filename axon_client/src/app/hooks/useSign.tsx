import type { TResponse, TUser } from "@/types";
import axios, { AxiosError } from "axios";

interface ISendUserDataSignUp {
  email: string;
  username: string;
  password: string;
}

const useSign = () => {
  const sendSignUpData = async ({ email, password, username }: ISendUserDataSignUp) => {
    const signUpData: Omit<TUser, "userImage"> = {
      email,
      username,
      password,
    };

    try {
      const { data } = await axios.post<TResponse>("http://localhost:3001/api/auth/sign-up", signUpData, {
        withCredentials: true,
      });

      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.message);
      }
    }
  };

  return { sendSignUpData };
};

export default useSign;
