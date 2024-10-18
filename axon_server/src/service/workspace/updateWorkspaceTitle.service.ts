import { WorkspaceRepository } from "../../repository/workspace.repository.js";
import type { TAxonResponse } from "../../utils/axonResponse.js";
import axonResponse from "../../utils/axonResponse.js";

const workspaceRepo = new WorkspaceRepository();
const updateWorkspaceTitleService = async (
	userId: string,
	workspaceId: string,
	title: string,
): Promise<TAxonResponse> => {
	try {
		const updatedWorkspace = await workspaceRepo.updateWorkspaceTitleById(
			userId,
			title,
			workspaceId,
		);
		if (updatedWorkspace.isError.error) {
			return axonResponse(400, {
				data: null,
				status: "error",
				message: updatedWorkspace.isError.errorMessage,
			});
		}

		return axonResponse(201, {
			data: updatedWorkspace.workspace,
			status: "success",
			message: "workspace title was updated successfully",
		});
	} catch (error) {
		if (error instanceof Error) {
			console.log(`Error in updateWorkspaceTitleService ${error.message}`);
			throw new Error(`Error in updateWorkspaceTitleService ${error.message}`);
		}
		throw new Error(`An unknown error ocurred ${error}`);
	}
};

export default updateWorkspaceTitleService;
