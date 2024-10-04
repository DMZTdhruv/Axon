import { WorkspaceRepository } from "../../repository/workspace.repository.js";
import type { TAxonResponse } from "../../utils/axonResponse.js";
import axonResponse from "../../utils/axonResponse.js";

const workspaceRepo = new WorkspaceRepository();
const deleteWorkspaceService = async (
	userId: string,
	workspaceId: string,
): Promise<TAxonResponse> => {
	try {
		const { isError, workspace } = await workspaceRepo.deleteWorkspaceById(
			userId,
			workspaceId,
		);

		if (isError.error) {
			return axonResponse(400, {
				data: null,
				success: false,
				message: isError.errorMessage,
			});
		}

		return axonResponse(200, {
			data: workspace,
			success: true,
			message: "Workspace deleted successfully",
		});
	} catch (error) {
		if (error instanceof Error) {
			console.log(`Error in deleteWorkspaceService ${error.message}`);
			throw new Error(error.message);
		}
		console.log(error);
		throw new Error("An unknown error ocurred");
	}
};

export default deleteWorkspaceService;
