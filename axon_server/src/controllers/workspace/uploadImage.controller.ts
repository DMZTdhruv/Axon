import type { Request, Response } from "express";
import { uploadImageService } from "../../service/workspace/uploadImage.service.js";
import type { UploadedFile } from "../../types.js";
import { validateUploadImage } from "../../validators/workspace.validator.js";

type UploadImageBody = {
	workspaceId: string;
	file: UploadedFile;
};

export const uploadImageController = async (req: Request, res: Response) => {
	try {
		const { workspaceId }: UploadImageBody = req.body;
		const file = req.file as UploadedFile;
		const user = req.user;
		const validate = validateUploadImage(user, workspaceId, file);
		if (validate.error) {
			return res.status(400).json(validate.errorMessage);
		}

		const { statusCode, response } = await uploadImageService(
			user._id,
			workspaceId,
			file,
		);

		return res.status(statusCode).json(response);
	} catch (error) {
		if (error instanceof Error)
			console.log(`Error in uploadImageController ${error.message}`);

		return res.status(500).json({ error: "Internal server error." });
	}
};
