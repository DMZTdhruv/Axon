import type { Request, Response } from "express";
import { UploadedFile } from "../types/types.js";
import { internalServerErrorResponse } from "../constant.js";
import { validateUploadImage } from "../validators/workspace.validator.js";
import { embedImageService } from "../service/workspace/embedImage.service.js";

const embedImageController = async (req: Request, res: Response) => {
	try {
		const { workspaceId } = req.body;
		const file = req.file as UploadedFile;
		const user = req.user;

		console.log()
		const validate = validateUploadImage(user, workspaceId, file);

		if (validate.error) {
			return res.status(400).json({
				status: "error",
				message: validate.errorMessage,
				data: null,
			});
		}

		const { statusCode, response } = await embedImageService(
			user._id,
			workspaceId,
			file,
		);
		return res.status(statusCode).json(response);
	} catch (error) {
		if (error instanceof Error) {
			console.log(`Error in demoFunc ${error.message}`);
		}
		return res.status(500).json(internalServerErrorResponse);
	}
};

export default embedImageController;
