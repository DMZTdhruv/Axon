import type { Request, Response } from "express";
import { checkAuthService } from "../../service/auth/auth.service.js";

export const authController = (req: Request, res: Response) => {
	try {
		console.log(req.headers);
		const axonToken = req.cookies.axon_user;
		const { error, message, statusCode, user } = checkAuthService(axonToken);
		const response = {
			data: user,
			message,
			success: error ? "false" : "true",
		};

		return res.status(statusCode).json(response);
	} catch (error) {
		if (error instanceof Error) {
			console.log(`Error in auth controller ${error.message}`);
		}

		return res.status(500).json({ error: "Internal server error" });
	}
};
