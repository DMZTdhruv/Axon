import mongoose from "mongoose";
import type { IBlog, IBlogContent } from "../types/types.js";

const blogContent = new mongoose.Schema<IBlogContent>(
	{
		content: { type: Object, required: true },
		workspaceId: { type: String, ref: "workspace", required: true },
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" },
	},
	{ timestamps: true },
);

export const BlogContent = mongoose.model<IBlogContent>(
	"BlogContent",
	blogContent,
);

const blogSchema = new mongoose.Schema<IBlog>(
	{
		createdBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },
		workspaceId: { type: String, ref: "Workspace", required: true },
		content: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "BlogContent",
			default: null,
		},
	},
	{ timestamps: true },
);

export const Blog = mongoose.model<IBlog>("Blog", blogSchema);
