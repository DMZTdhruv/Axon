import User from "../models/user.model.js";
import type { ErrorMessageReturn, IUser, IWorkspace } from "../types/types.js";
import type { TUser } from "../types/types.js";
import { hashPassword } from "../utils/hash.utils.js";
import { errorMessage } from "../validators/errorResponse.js";

export class UserRepository {
	async createUser(userData: TUser): Promise<Omit<IUser, "password">> {
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
			email: savedUser.email,
		};

		return user as Omit<IUser, "password">;
	}

	async getUserById(userId: string): Promise<IUser | null> {
		const user = await User.findById(userId).select("-password");
		if (!user?._id) return null;
		return user;
	}

	async getUserByEmail(userEmail: string): Promise<IUser | null> {
		const user = await User.findOne({ email: userEmail }).select("-password");
		if (!user?._id) return null;
		return user;
	}

	async getUserByEmailWithPassword(userEmail: string): Promise<IUser | null> {
		const user = await User.findOne({ email: userEmail });
		if (!user?._id) return null;
		return user;
	}

	async pushWorkspaceToUser(
		workspaceId: string,
		userId: string,
		workspace: "main" | "axonverse",
	): Promise<ErrorMessageReturn> {
		const user = await this.getUserById(userId);
		if (!user) return errorMessage(true, "user not found");
		if (workspace === "main") {
			user.workspaces.main.push(workspaceId as string & IWorkspace);
		} else {
			user.workspaces.axonverse.push(workspaceId as string & IWorkspace);
		}

		await user.save();
		return errorMessage(false, "");
	}

	async removeWorkspaceFromUser(
		workspaceId: string,
		userId: string,
		workspace: "main" | "axonverse",
	): Promise<ErrorMessageReturn> {
		const user = await this.getUserById(userId);
		if (!user) return errorMessage(true, "User not found");

		if (workspace === "main") {
			//@ts-ignore
			user.workspaces.main = user.workspaces.main.filter(
				(id) => id !== workspaceId,
			);
		} else {
			user.workspaces.axonverse = user.workspaces.axonverse.filter(
				(id) => id !== workspaceId,
			);
		}

		await user.save();
		return errorMessage(false, "Workspace removed successfully");
	}
}
