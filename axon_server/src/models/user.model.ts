import mongoose, { Schema } from "mongoose";
import type { IUser } from "../types/types";

const userSchema = new Schema<IUser>(
	{
		username: { type: String, required: true, unique: true, trim: true },
		email: { type: String, required: true, unique: true, trim: true },
		password: { type: String, required: true },
		userImage: { type: String, unique: false },
		workspaces: {
			main: [
				{
					type: String,
					ref: "Workspace",
				},
			],
			axonverse: [
				{
					type: String,
					ref: "Workspace",
				},
			],
		},
		preferences: {
			theme: {
				type: String,
				default: "dark",
			},
		},
	},
	{
		timestamps: true,
	},
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
