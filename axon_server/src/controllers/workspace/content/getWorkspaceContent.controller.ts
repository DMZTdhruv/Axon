import type { Request, Response } from "express";
import { validateGetWorkspaceContent } from "../../../validators/workspace.validator.js";
import getWorkspaceContentService from "../../../service/workspace/content/getWorkspaceContent.service.js";
import { internalServerErrorResponse } from "../../../constant.js";

const getWorkspaceContentController = async (req: Request, res: Response) => {
	try {
		const user = req.user;
		const { workspaceId } = req.query;

		console.log(req.params);
		const { error, errorMessage } = validateGetWorkspaceContent(
			user._id,
			workspaceId as string,
		);

		if (error) {
			return res.status(400).json({ error: errorMessage });
		}

		const { statusCode, response } = await getWorkspaceContentService(
			user._id,
			workspaceId as string,
		);

		return res.status(statusCode).json(response);
	} catch (error) {
		if (error instanceof Error) {
			console.log(`Error in getWorkspaceController${error.message}`);
			return res.status(500).json(internalServerErrorResponse);
		}
		console.log(`Error in getWorkspaceController${error}`);
		return res.status(500).json(internalServerErrorResponse);
	}
};

export default getWorkspaceContentController;