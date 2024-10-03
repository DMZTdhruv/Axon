import type { IJwtUser } from "../middleware/auth.middleware.js";
import { errorMessage } from "./errorResponse.js";

interface UploadedFile extends Express.Multer.File {}
export const validateUploadImage = (
	user: IJwtUser ,
	workspaceId: string,
	file: UploadedFile,
) => {
	if (!user || !workspaceId || !file) {
		return errorMessage(true, "incomplete data provided");
	}
	return errorMessage(false, "");
};


type ValidateCreateWorkspaceControllerRequest = {
   _id: string,
   workspace: 'main' | 'axonverse',
	createdBy: string,
}
export const validateCreateWorkspace = ({_id, workspace, createdBy}:ValidateCreateWorkspaceControllerRequest) => {
	if(!_id || !createdBy || (workspace !== 'main' && workspace !== 'axonverse')) {
		return errorMessage(true, "incomplete data provided");
	}
	return errorMessage(false, "");
}