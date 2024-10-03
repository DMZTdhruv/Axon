import mongoose from "mongoose";
import type { IContent, IWorkspace } from "../types.js";

const workspaceContentSchema = new mongoose.Schema<IContent>(
	{
		content: { type: Object, required: true },
		workspaceId: { type: String, ref: "workspace", required: true },
		createdBy: { type: mongoose.Types.ObjectId, ref: "user", required: true },
	},
	{ timestamps: true },
);

export const WorkspaceContent = mongoose.model<IContent>(
	"WorkspaceContent",
	workspaceContentSchema,
);

const workspaceSchema = new mongoose.Schema<IWorkspace>(
	{
		_id: { type: String, required: true },
		title: { type: String, default: "untitled" },
		icon: { type: String, default: "axon_logo.svg" },
		cover: { type: String },
		coverPos: { type: Number, default: 50 },
		workspace: { type: String, enum: ["main", "axonverse"], required: true },
		private: { type: Boolean, default: true },
		parentPageId: { type: String, ref: "Workspace", default: null },
		privileges: [
			{
				userId: { type:mongoose.Types.ObjectId, ref: "User", required: true },
				role: { type: String, enum: ["owner", "visitor"], required: true },
			},
		],
		subPages: [{ type: String, ref: "Workspace" }],
		contentId: { type: mongoose.Types.ObjectId, ref: "WorkspaceContent"},
		createdBy: { type: mongoose.Types.ObjectId, ref: 'User', required: true }
	},
	{
		timestamps: true,
	},
);

export const Workspace = mongoose.model<IWorkspace>(
	"Workspace",
	workspaceSchema,
);
