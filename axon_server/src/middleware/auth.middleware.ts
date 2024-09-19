import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface IJwtUser {
	_id: string;
	username: string;
}

const authenticateJsonWebToken = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const secretKey = process.env.SECRET_KEY;
		if (!secretKey) {
			throw new Error("No secret key provided");
		}

		const token = req.cookies.axon_user;
		console.log("Cookies:", req.cookies);
		if (!token) {
			return res.status(401).json({ error: "Unauthorized user" });
		}

		const decoded = jwt.verify(token, secretKey) as IJwtUser;
		if (!decoded) {
			return res.status(401).json({ error: "Invalid token" });
		}

		req.user = decoded;

		return next();
	} catch (error) {
		console.error(error);
		return res.status(401).json({ error: "Invalid token" });
	}
};

export default authenticateJsonWebToken;
