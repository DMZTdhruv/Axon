import type { Request, Response } from "express";
import deleteWorkspaceService from "../../service/workspace/deleteWorkspace.service.js";
import { validateDeleteWorkspace } from "../../validators/workspace.validator.js";
import { internalServerErrorResponse } from "../../constant.js";

const deleteWorkspaceController = async (req: Request, res: Response) => {
	try {
		const user = req.user;
		console.log("hello world");
		const { workspaceId } = req.params;
		const { error, errorMessage } = validateDeleteWorkspace(
			user._id,
			workspaceId,
		);
		if (error) {
			return res.status(400).json({ error: errorMessage });
		}
		const { statusCode, response } = await deleteWorkspaceService(
			user._id,
			workspaceId,
		);
		return res.status(statusCode).json(response);
	} catch (error) {
		if (error instanceof Error) {
			console.log(`Error in deleteWorkspaceController ${error.message}`);
			return res.status(500).json(internalServerErrorResponse);
		}
		console.log(`Error in deleteWorkspaceController ${error}`);
		return res.status(500).json(internalServerErrorResponse);
	}
};

export default deleteWorkspaceController;
