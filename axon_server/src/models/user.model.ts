import mongoose, { type Document, Schema } from "mongoose";

export interface IUser extends Document {
	username: string;
	email: string;
	userImage: string;
	password: string;
	createdAt: Date;
	updatedAt: Date;
	workspaces: {
		main: Schema.Types.ObjectId[];
		everything: Schema.Types.ObjectId[];
	};
	preferences: {
		theme: string;
	};
}

const userSchema = new Schema<IUser>(
	{
		username: { type: String, required: true, unique: true, trim: true },
		email: { type: String, required: true, unique: true, trim: true },
		password: { type: String, required: true },
		userImage: { type: String, unique: false },
		workspaces: {
			main: [
				{
					type: Schema.Types.ObjectId,
				},
			],
			everything: [
				{
					type: Schema.Types.ObjectId,
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
