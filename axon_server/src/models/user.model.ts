import mongoose, { Schema } from "mongoose";
import type { IUser } from "../types";

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
				},
			],
			axonverse: [
				{
					type: String,
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
