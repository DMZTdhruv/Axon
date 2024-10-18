import type { Request, Response } from "express";
import { internalServerErrorResponse } from "../../constant.js";
import { validatePushWorkspaceData } from "../../validators/workspace.validator.js";
import pushWorkspaceService from "../../service/workspace/pushWorkspace.service.js";

const pushWorkspaceController = async (req: Request, res: Response) => {
	try {
		const user = req.user;
		const { currentWorkspaceId, toWorkspaceId, toWorkspaceType } = req.body;
		
		// checking if the request is valid or not
		const { error, errorMessage } = validatePushWorkspaceData({
			currentWorkspaceId,
			toWorkspaceId,
			toWorkspaceType,
		});
		if (error) {
			return res.status(400).json({
				status: "error",
				message: errorMessage,
				data: null,
			});
		}

		// getting the response and statuscode form the service
		const { statusCode, response } = await pushWorkspaceService({
			userId: user._id,
			toWorkspaceId,
			toWorkspaceType,
			currentWorkspaceId,
		});
		return res.status(statusCode).json(response);
	} catch (error) {
		if (error instanceof Error) {
			console.log(`Error in pushWorkspaceController ${error.message}`);
			return res.status(500).json(internalServerErrorResponse);
		}
		console.log(`Error in pushWorkspaceController ${error}`);
		return res.status(500).json(internalServerErrorResponse);
	}
};

export default pushWorkspaceController;
