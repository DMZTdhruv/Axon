import type { IJwtUser } from "../middleware/auth.middleware.js";
import { ErrorMessageReturn } from "../types/types.js";
import { errorMessage } from "./errorResponse.js";

const INCOMPLETE_DATA = "Incomplete data was provided";
const INVALID_DATA = "Invalid data was provided";

interface UploadedFile extends Express.Multer.File {}

/*
	THESE ARE ALL THE VALIDATORS FOR [WORKSPACE], KINDLY GO THROUGH THEM, THE SYNTAX IS CLEAR AND EASY TO UNDERSTAND
*/


export const validateUploadImage = (
	user: IJwtUser,
	workspaceId: string,
	file: UploadedFile,
) => {
	if (!user || !workspaceId || !file) {
		return errorMessage(true, "incomplete data provided");
	}
	const { size, mimetype } = file;
	const validImageTypes = [
		"image/png",
		"image/svg",
		"image/gif",
		"image/jpeg",
		"image/tiff",
	];
	if (!validImageTypes.includes(mimetype)) {
		return errorMessage(true, "not a valid image format.");
	}
	const maxFileSize = 5 * 1024 * 1024;
	if (size > maxFileSize) return errorMessage(true, "image is too big.");

	return errorMessage(false, "");
};

export const validateCommonValues = (userId: string, workspaceId: string) => {
	if (!userId || !workspaceId) {
		return errorMessage(true, INCOMPLETE_DATA);
	}
	return errorMessage(false, "");
};

type ValidateCreateWorkspaceControllerRequest = {
	_id: string;
	workspace: "main" | "axonverse";
	createdBy: string;
};
type ValidateCreateSubWorkspaceControllerRequest = {
	_id: string;
	workspace: "main" | "axonverse";
	createdBy: string;
	parentPageId: string;
};
export const validateCreateWorkspace = ({
	_id,
	workspace,
	createdBy,
}: ValidateCreateWorkspaceControllerRequest) => {
	if (
		!_id ||
		!createdBy ||
		(workspace !== "main" && workspace !== "axonverse")
	) {
		return errorMessage(true, "incomplete data provided");
	}
	return errorMessage(false, "");
};
export const validateSubCreateWorkspace = ({
	_id,
	workspace,
	createdBy,
	parentPageId,
}: ValidateCreateSubWorkspaceControllerRequest) => {
	if (
		!_id ||
		!createdBy ||
		(workspace !== "main" && workspace !== "axonverse") ||
		!parentPageId
	) {
		return errorMessage(true, INCOMPLETE_DATA);
	}
	return errorMessage(false, "");
};

export const validateGetParentWorkspacesController = (userId: string) => {
	if (!userId) return errorMessage(true, "unauthorized user");
	return errorMessage(false, "");
};
export const validateDeleteWorkspace = (
	userId: string,
	workspaceId: string,
) => {
	if (!userId || !workspaceId) return errorMessage(true, "unauthorized user");
	return errorMessage(false, "");
};
export const validateUpdateTitleWorkspace = (
	userId: string,
	title: string,
	workspaceId: string,
) => {
	if (!userId || !title || !workspaceId) {
		return errorMessage(
			true,
			"missing required fields to update the title of the workspace",
		);
	}

	if (title.trim().length === 0) {
		return errorMessage(true, "title is too short");
	}

	if (title.trim().length > 100) {
		return errorMessage(true, "title is too big");
	}

	return errorMessage(false, "");
};

export const validateUpdateWorkspaceWidth = (
	userId: string,
	workspaceId: string,
	width: "sm" | "lg",
): ErrorMessageReturn => {
	if (!userId || !workspaceId || !width) {
		return errorMessage(true, INCOMPLETE_DATA);
	}

	const allowedWidth = ["sm", "lg"];
	if (!allowedWidth.includes(width)) {
		return errorMessage(true, INVALID_DATA);
	}

	return errorMessage(false, "");
};

export const validateUpdateWorkspaceContent = (
	userId: string,
	workspaceId: string,
	// biome-ignore lint/complexity/noBannedTypes: <explanation>
	content: Object,
): ErrorMessageReturn => {
	if (!userId || !workspaceId || !isValidContent(content)) {
		return errorMessage(true, INCOMPLETE_DATA);
	}
	return errorMessage(false, "");
};

const isValidContent = (content: any): boolean => {
	return (
		typeof content === "object" && content !== null && !Array.isArray(content)
	);
};

export const validateGetWorkspaceContent = (
	userId: string,
	workspaceId: string,
): ErrorMessageReturn => {
	if (!userId || !workspaceId) {
		return errorMessage(true, INCOMPLETE_DATA);
	}
	return errorMessage(false, "");
};

export const validateWorkspaceYPosition = (
	workspaceId: string,
	userId: string,
	yPos: number,
): ErrorMessageReturn => {
	if (!workspaceId || !userId) {
		return errorMessage(true, INCOMPLETE_DATA);
	}

	if (typeof yPos !== "number" || Number.isNaN(yPos)) {
		return errorMessage(true, "Invalid y-position value");
	}

	// Assuming a reasonable range for y-position, e.g., 0 to 1000
	if (yPos < 0 || yPos > 100) {
		return errorMessage(true, "Y-position out of valid range");
	}

	return errorMessage(false, "");
};

type ValidatePushWorkspaceData = {
	currentWorkspaceId: string;
	toWorkspaceId: string;
	toWorkspaceType: string;
};

export const validatePushWorkspaceData = ({
	currentWorkspaceId,
	toWorkspaceId,
	toWorkspaceType,
}: ValidatePushWorkspaceData): ErrorMessageReturn => {
	if (!currentWorkspaceId || !toWorkspaceId || !toWorkspaceType) {
		return errorMessage(true, INCOMPLETE_DATA);
	}

	return errorMessage(false, "");
};

export const validateUpdateWorkspaceIcon = (
	iconName: string | null,
	workspaceId: string,
	userId: string,
) => {
	if (!workspaceId || !userId) {
		return errorMessage(true, INCOMPLETE_DATA);
	}

	if (iconName !== null && typeof iconName !== "string") {
		return errorMessage(true, INVALID_DATA);
	}

	return errorMessage(false, "");
};
