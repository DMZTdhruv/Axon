export interface IUser extends Document {
	username: string;
	email: string;
	userImage: string;
	password: string;
	createdAt: Date;
	updatedAt: Date;
	workspaces: {
		main: Schema.Types.ObjectId[];
		axonverse: Schema.Types.ObjectId[];
	};
	preferences: {
		theme: string;
	};
}

export type TValidateResponse = {
	error: boolean;
	errorMessage: string;
};

export type ErrorMessageReturn = {
	error: boolean;
	errorMessage: string;
};

interface UploadedFile extends Express.Multer.File {}
export interface UploadImageParams {
	file: UploadedFile;
	workspaceId: string;
	userId: string;
}

export type UploadImageReturn = {
	imageId: string;
	url: string;
};

export type TPrivileges = {
	userId: string;
	role: "owner" | "visitor";
};

import type { Document } from "mongoose";
export interface IWorkspace extends Document {
	_id: string;
	title?: string;
	icon?: string;
	cover?: string;
	coverPos?: number;
	workspace: "main" | "axonverse";
	private: boolean,
	parentPageId?: string | null;
	childPageId?: string | null;
	privileges: TPrivileges[];
	subPages?: string[];
	contentId?: string;
	createdBy: IUser
	createdAt: Date;
	updatedAt: Date;
}

export interface IContent extends Document {
	// biome-ignore lint/complexity/noBannedTypes: <explanation>
	content: Object;
	workspaceId: string;
	createdBy: IUser;
	createdAt: Date;
	updatedAt: Date;
}
