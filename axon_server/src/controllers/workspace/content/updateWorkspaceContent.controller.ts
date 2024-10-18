import type { Request, Response } from "express";
import updateWorkspaceContentService from "../../../service/workspace/content/createWorkspaceContent.service.js";
import { validateUpdateWorkspaceContent } from "../../../validators/workspace.validator.js";
import { internalServerErrorResponse } from "../../../constant.js";

const updateWorkspaceContentController = async (
	req: Request,
	res: Response,
) => {
	try {
		const user = req.user;
		const { workspaceId, content } = req.body;

		const { error, errorMessage } = validateUpdateWorkspaceContent(
			user._id,
			workspaceId,
			content,
		);
		if (error) {
			return res.status(400).json({ error: errorMessage });
		}

		const { statusCode, response } = await updateWorkspaceContentService({
			workspaceId,
			userId: user._id,
			content,
		});

		return res.status(statusCode).json(response);
	} catch (error) {
		if (error instanceof Error) {
			console.log(`Error in updateWorkspaceContentController ${error.message}`);
			return res.status(500).json(internalServerErrorResponse);
		}
		console.log(`Error in updateWorkspaceContentController ${error}`);
		return res.status(500).json(internalServerErrorResponse);
	}
};

export default updateWorkspaceContentController;
