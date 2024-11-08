import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.SECRET_KEY || "your-secret-key";

export function verifyToken(token: string): { _id: string } | null {
	try {
		// Verify the token using the secret key and return the decoded payload
		return jwt.verify(token, JWT_SECRET) as { _id: string };
	} catch (error) {
		// Return null if token verification fails
		return null;
	}
}
