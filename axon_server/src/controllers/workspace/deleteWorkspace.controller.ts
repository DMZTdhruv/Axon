import type { Request, Response } from "express";
import deleteWorkspaceService from "../../service/workspace/deleteWorkspace.service.js";
import { validateDeleteWorkspace } from "../../validators/workspace.validator.js";

const deleteWorkspaceController = async (req: Request, res: Response) => {
	try {
		const user = req.user;
		const { workspaceId } = req.params;
		console.log("////////////////////////////////////////////////////////////////////////////////////////////////////////")
		console.log({ userId: user._id, workspaceId });
		console.log("////////////////////////////////////////////////////////////////////////////////////////////////////////")
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
		}
		return res.status(500).json({ error: "internal server error" });
	}
};

export default deleteWorkspaceController;
