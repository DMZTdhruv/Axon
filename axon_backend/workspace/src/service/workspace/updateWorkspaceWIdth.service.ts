import { WorkspaceRepository } from "../../repository/workspace.repository.js";
import type { TAxonResponse } from "../../utils/axonResponse.js";
import axonResponse from "../../utils/axonResponse.js";

const workspaceRepo = new WorkspaceRepository();
export const updateWorkspaceWidthService = async (
	userId: string,
	workspaceId: string,
	width: "sm" | "lg",
): Promise<TAxonResponse> => {
	try {
		const { isError, workspace } = await workspaceRepo.updateWorkspaceWidth(
			userId,
			workspaceId,
			width,
		);

		if (isError.error) {
			return axonResponse(400, {
				status: "error",
				message: isError.errorMessage,
				data: null,
			});
		}

		return axonResponse(201, {
			status: "success",
			data: workspace,
			message: "workspace width updated successfully",
		});
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Error in updateWorkspaceWidthService: ${error.message}`);
		}
		throw new Error(`unknown Error in updateWorkspaceWidthService: ${error}`);
	}
};

export default updateWorkspaceWidthService;
