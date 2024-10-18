export type TUser = {
	_id: string;
	email: string;
	username: string;
	password: string;
	userImage: string;
};

export type TCreateWorkspaceControllerRequest = {
	_id: string;
	workspace: "main" | "axonverse";
	createdBy: string;
};

export type TCreateSubParentWorkspaceControllerRequest = {
	_id: string;
	workspace: "main" | "axonverse";
	createdBy: string;
};

export type TCreateWorkspaceService = {
	_id: string;
	workspace: "main" | "axonverse";
	createdBy: string;
};

export type TCreateSubWorkspaceService = {
	_id: string;
	workspace: "main" | "axonverse";
	createdBy: string;
	parentPageId: string;
};
export interface IUser extends Document {
	username: string;
	email: string;
	userImage: string;
	password: string;
	createdAt: Date;
	updatedAt: Date;
	workspaces: {
		main: string[] | IWorkspace[];
		axonverse: string[];
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

export interface UploadedFile extends Express.Multer.File {}
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
	role: "owner" | "visitor" | "friend";
};

import type { Document } from "mongoose";
export interface IWorkspace extends Document {
	_id: string;
	title?: string;
	icon: string | null;
	cover?: string;
	coverPos?: number;
	workspace: "main" | "axonverse";
	workspaceWidth: "sm" | "lg";
	private: boolean;
	parentPageId?: string | null;
	childPageId?: string | null;
	privileges: TPrivileges[];
	subPages: string[] | IWorkspace[];
	content: string | null;
	createdBy: IUser;
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
