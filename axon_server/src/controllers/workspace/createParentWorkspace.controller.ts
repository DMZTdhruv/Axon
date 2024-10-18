import type { Request, Response } from "express";
import { validateCreateWorkspace } from "../../validators/workspace.validator.js";
import type { TCreateWorkspaceControllerRequest } from "../../types/types.js";
import { createWorkspaceService } from "../../service/workspace/createWorkspace.service.js";
import { internalServerErrorResponse } from "../../constant.js";

export const createParentWorkspaceController = async (
	req: Request,
	res: Response,
) => {
	try {
		const user = req.user;
		const { _id, workspace, createdBy }: TCreateWorkspaceControllerRequest =
			req.body;
		console.log({ _id, workspace, createdBy });
		// checking if the workspace was created by an authorized user or not
		if (createdBy !== user._id) {
			return res.status(400).json({ error: "unauthorized user" });
		}

		// Validating the workspace request
		const validate = validateCreateWorkspace({ _id, workspace, createdBy });
		if (validate.error) {
			return res.status(400).json({ error: validate.errorMessage });
		}

		//creation of workspace
		const { statusCode, response } = await createWorkspaceService({
			_id,
			workspace,
			createdBy,
		});
		return res.status(statusCode).json(response);
	} catch (error) {
		if (error instanceof Error) {
			console.log(`Error in createWorkspaceController: ${error.message}`);
			return res.status(500).json(internalServerErrorResponse);
		}
		console.log(`Error in createWorkspaceController: ${error}`);
		return res.status(500).json(internalServerErrorResponse);
	}
};
