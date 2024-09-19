import {
	userSignInService,
	userSignUpService,
} from "../service/user.service.js";
import type { TUser } from "../types/types.js";
import type { Request, Response } from "express";
import type { TResponse } from "../utils/axonResponse.js";

const AXON_USER: string = "axon_user";

export const userSingUpController = async (req: Request, res: Response) => {
	try {
		const user: TUser = req.body;
		console.log(user);
		const { jwtToken, axonResponse } = await userSignUpService(user);

		const isDev = process.env.NODE_ENV !== "production";
		console.log(isDev);

		if (jwtToken !== "") {
			res.cookie(AXON_USER, jwtToken, {
				httpOnly: true,
				secure: !isDev,
				sameSite: isDev ? "lax" : "strict",
				maxAge: 30 * 24 * 60 * 60 * 1000,
			});
		}

		return res.status(axonResponse.statusCode).json(axonResponse.response);
	} catch (error) {
		if (error instanceof Error)
			console.log("Error occurred in controller", error.message);
		return res.status(500).json({ error: "internal server error" });
	}
};

export const userSignOutController = async (req: Request, res: Response) => {
	try {
		const user = req.user;
		if (!user?._id) {
			return res.status(401).json({ error: "unauthorized user." });
		}
		const isDev = process.env.NODE_ENV !== "production";
		res.cookie(AXON_USER, "", {
			httpOnly: true,
			secure: !isDev,
			sameSite: isDev ? "lax" : "strict",
			expires: new Date(0),
		});
		const response: TResponse = {
			message: "signed out successfully",
			data: null,
			success: true,
		};

		return res.status(200).json({ response });
	} catch (error) {
		if (error instanceof Error)
			console.log("Error occurred in controller", error.message);
		return res.status(500).json({ error: "internal server error" });
	}
};

// logging in controllers
export const userLogInController = async (req: Request, res: Response) => {
	try {
		const userData: TUser = req.body;
		const { jwtToken, axonResponse } = await userSignInService(userData);

		const isDev = process.env.NODE_ENV !== "production";
		if (jwtToken !== "") {
			res.cookie(AXON_USER, jwtToken, {
				httpOnly: true,
				secure: !isDev,
				sameSite: isDev ? "lax" : "strict",
				maxAge: 30 * 24 * 60 * 60 * 1000,
			});
		}

		return res.status(axonResponse.statusCode).json(axonResponse.response);
	} catch (error) {
		if (error instanceof Error)
			console.log("Error occurred in userLogIn controller", error.message);
		return res.status(500).json({ error: "internal server error" });
	}
};
