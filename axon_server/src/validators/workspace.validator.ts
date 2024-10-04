import type { IJwtUser } from "../middleware/auth.middleware.js";
import { errorMessage } from "./errorResponse.js";

interface UploadedFile extends Express.Multer.File {}
export const validateUploadImage = (
	user: IJwtUser,
	workspaceId: string,
	file: UploadedFile,
) => {
	if (!user || !workspaceId || !file) {
		return errorMessage(true, "incomplete data provided");
	}
	return errorMessage(false, "");
};

type ValidateCreateWorkspaceControllerRequest = {
	_id: string;
	workspace: "main" | "axonverse";
	createdBy: string;
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

export const validateGetParentWorkspacesController = (userId: string) => {
	if (!userId) return errorMessage(true, "unauthorized user");
	return errorMessage(false, "");
};
export const validateDeleteWorkspace = (userId: string, workspaceId: string) => {
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
