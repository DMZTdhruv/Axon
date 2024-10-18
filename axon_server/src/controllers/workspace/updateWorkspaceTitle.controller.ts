import type { Request, Response } from "express";
import { validateUpdateTitleWorkspace } from "../../validators/workspace.validator.js";
import updateWorkspaceTitleService from "../../service/workspace/updateWorkspaceTitle.service.js";
import { internalServerErrorResponse } from "../../constant.js";

type UpdateWorkspaceRenameController = {
	title: string;
	workspaceId: string;
};

const updateWorkspaceTitleController = async (req: Request, res: Response) => {
	try {
		const user = req.user;
		const { title, workspaceId }: UpdateWorkspaceRenameController = req.body;
		console.log({
			userId: user._id,
			title,
			workspaceId,
		});
		const validate = validateUpdateTitleWorkspace(user._id, title, workspaceId);
		if (validate.error) {
			return res.status(400).json({ error: validate.errorMessage });
		}

		const { statusCode, response } = await updateWorkspaceTitleService(
			user._id,
			workspaceId,
			title,
		);

		return res.status(statusCode).json(response);
	} catch (error) {
		if (error instanceof Error) {
			console.log(`Error in updateWorkspaceTitleController ${error.message}`);
			return res.status(500).json(internalServerErrorResponse);
		}
		console.log(`Error in updateWorkspaceTitleController ${error}`);
		return res.status(500).json(internalServerErrorResponse);
	}
};

export default updateWorkspaceTitleController;
