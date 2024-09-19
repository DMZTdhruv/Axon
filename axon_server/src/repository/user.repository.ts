import type { IUser } from "../models/user.model.js";
import User from "../models/user.model.js";
import type { TUser } from "../types/types.js";
import { hashPassword } from "../utils/hash.utils.js";

export class UserRepository {
	async createUser(userData: TUser): Promise<Omit<IUser, "password">> {
		try {
			const hashedPassword = await hashPassword(userData.password);

			const newUser = new User({
				email: userData.email,
				password: hashedPassword,
				username: userData.username,
				userImage: userData.userImage,
			});

			const savedUser = await newUser.save();
			const user = {
				_id: savedUser._id,
				username: savedUser.username,
				email: savedUser.email
			}

			return user as Omit<IUser, "password">;
		} catch (err) {
			if (err instanceof Error) {
				throw new Error(`error occurred: ${err.message}`);
			}
			throw new Error("An unknown error occurred while creating user");
		}
	}

	async getUserById(userId: string): Promise<IUser | null> {
		try {
			const user = await User.findById(userId).select("-password");
			if (!user?._id) return null;
			return user;
		} catch (err) {
			if (err instanceof Error) {
				throw new Error(`error occurred: ${err.message}`);
			}
			throw new Error("An unknown error occurred while creating user");
		}
	}

	async getUserByEmail(userEmail: string): Promise<IUser | null> {
		try {
			const user = await User.findOne({ email: userEmail }).select("-password");
			if (!user?._id) return null;
			return user;
		} catch (err) {
			if (err instanceof Error) {
				throw new Error(`error occurred: ${err.message}`);
			}
			throw new Error("An unknown error occurred while creating user");
		}
	}
	async getUserByEmailWithPassword(userEmail: string): Promise<IUser | null> {
		try {
			const user = await User.findOne({ email: userEmail });
			if (!user?._id) return null;
			return user;
		} catch (err) {
			if (err instanceof Error) {
				throw new Error(`error occurred: ${err.message}`);
			}
			throw new Error("An unknown error occurred while creating user");
		}
	}
}
