import { Request, Response } from "express";
import updateWorkspaceWidthService from "../../service/workspace/updateWorkspaceWIdth.service.js";
import {
	validateUpdateWorkspaceIcon,
	validateUpdateWorkspaceWidth,
	validateWorkspaceYPosition,
} from "../../validators/workspace.validator.js";
import updateWorkspaceYPosCoverService from "../../service/workspace/updateWorkspaceYPosCover.service.js";
import { internalServerErrorResponse } from "../../constant.js";
import updateWorkspaceIconService from "../../service/workspace/updateWorkspaceIcon.service.js";

export async function updateWorkspaceWidthController(
	req: Request,
	res: Response,
) {
	try {
		const user = req.user;
		const { workspaceId, width } = req.body;

		const { error, errorMessage } = validateUpdateWorkspaceWidth(
			user._id,
			workspaceId,
			width,
		);
		if (error) {
			return res.status(400).json({ error: errorMessage });
		}

		const { statusCode, response } = await updateWorkspaceWidthService(
			user._id,
			workspaceId,
			width,
		);

		return res.status(statusCode).json(response);
	} catch (error) {
		if (error instanceof Error) {
			console.log(`Error in updateWorkSpaceController ${error.message}`);
			return res.status(500).json("internal server error");
		}
		console.log(`Error in updateWorkspaceContentController ${error}`);
		return res.status(500).json("internal server error");
	}
}

export async function updateCoverYPositionController(
	req: Request,
	res: Response,
) {
	try {
		const user = req.user;
		const { yPos, workspaceId } = req.body;
		console.log(req.body);

		const { error, errorMessage } = validateWorkspaceYPosition(
			workspaceId,
			user._id,
			yPos,
		);
		if (error) {
			return res.status(400).json({ error: errorMessage });
		}

		const { statusCode, response } = await updateWorkspaceYPosCoverService(
			user._id,
			workspaceId,
			yPos,
		);

		console.log(response);

		return res.status(statusCode).json(response);
	} catch (error) {
		if (error instanceof Error) {
			console.log(`Error in updateWorkspaceContentController ${error.message}`);
			return res.status(500).json(internalServerErrorResponse);
		}
		console.log(`Error in updateWorkspaceContentController ${error}`);
		return res.status(500).json(internalServerErrorResponse);
	}
}

type UpdateWorkspaceCoverIconControllerRequest = {
	iconName: null | string;
	workspaceId: string;
};

const updateWorkspaceCoverIconController = async (
	req: Request,
	res: Response,
) => {
	try {
		const user = req.user;
		const { iconName, workspaceId }: UpdateWorkspaceCoverIconControllerRequest =
			req.body;

		const { error, errorMessage } = validateUpdateWorkspaceIcon(
			iconName,
			workspaceId,
			user._id,
		);

		if (error) {
			return res.status(400).json({ error: errorMessage });
		}

		const { statusCode, response } = await updateWorkspaceIconService(
			iconName,
			workspaceId,
			user._id,
		);

		return res.status(statusCode).json(response);
	} catch (error) {
		if (error instanceof Error) {
			console.log(
				`Error in updateWorkspaceCoverIconController ${error.message}`,
			);
		}
		return res.status(500).json(internalServerErrorResponse);
	}
};

export default updateWorkspaceCoverIconController;
