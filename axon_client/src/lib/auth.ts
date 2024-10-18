import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.SECRET_KEY || "your-secret-key";

export function verifyToken(token: string): { _id: string } | null {
	try {
		return jwt.verify(token, JWT_SECRET) as { _id: string };
	} catch (error) {
		return null;
	}
}
