import type { IJwtUser } from "../middleware/auth.middleware";
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
