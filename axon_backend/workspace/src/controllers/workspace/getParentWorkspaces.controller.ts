import type { Request, Response } from "express";
import getParentWorkspacesService from "../../service/workspace/getParentWorkspaces.service.js";
import { validateGetParentWorkspacesController } from "../../validators/workspace.validator.js";
import { internalServerErrorResponse } from "../../constant.js";

export const getParentWorkspacesController = async (
	req: Request,
	res: Response,
) => {
	try {
		const user = req.user;
		// reason: In case in future if we need to validate more data.
		const validate = validateGetParentWorkspacesController(user._id);
		if (validate.error) {
			return res.status(400).json({ error: validate.errorMessage });
		}
		const { statusCode, response } = await getParentWorkspacesService(user._id);
		return res.status(statusCode).json(response);
	} catch (error) {
		if (error instanceof Error) {
			console.log(`Error in getParentWorkspaceController: ${error.message}`);
			return res.status(500).json(internalServerErrorResponse);
		}
		console.log(`Error in getParentWorkspaceController: ${error}`);
		return res.status(500).json(internalServerErrorResponse);
	}
};
