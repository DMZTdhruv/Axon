import type { Request, Response } from "express";
import { validateSubCreateWorkspace } from "../../validators/workspace.validator.js";
import { createSubParentWorkspaceService } from "../../service/workspace/createParentSubWorkspace.service.js";
import { internalServerErrorResponse } from "../../constant.js";

export const createSubParentWorkspaceController = async (
	req: Request,
	res: Response,
) => {
	try {
		const user = req.user;
		const { _id, workspace, createdBy, parentPageId } = req.body;
		console.log({ _id, workspace, createdBy, parentPageId });
		
		// checking if the workspace was created by an authorized user or not
		if (createdBy !== user._id) {
			return res.status(400).json({ error: "unauthorized user" });
		}

		// Validating the workspace request
		const validate = validateSubCreateWorkspace({
			_id,
			workspace,
			createdBy,
			parentPageId,
		});

		if (validate.error) {
			return res.status(400).json({ error: validate.errorMessage });
		}

		//creation of workspace
		const { statusCode, response } = await createSubParentWorkspaceService({
			_id,
			workspace,
			createdBy,
			parentPageId,
		});
		return res.status(statusCode).json(response);
	} catch (error) {
		if (error instanceof Error) {
			console.log(
				`Error in createSubParentWorkspaceController: ${error.message}`,
			);
			return res.status(500).json(internalServerErrorResponse);
		}
		console.log(`Error in createSubParentWorkspaceController: ${error}`);
		return res.status(500).json(internalServerErrorResponse);
	}
};
