import jwt from "jsonwebtoken";

interface JWTUser {
	_id: string;
	username: string;
}

// generating jwt token
export const generateJsonWebToken = (userData: JWTUser) => {
	const secretKey = process.env.SECRET_KEY;
	if (!secretKey) {
		throw new Error("Secret error doesn't exists");
	}

	const token = jwt.sign(userData, secretKey, {
		expiresIn: "30d",
	});

	console.log({ jsonWebToken: token, userId: userData._id });

	return token;
};

