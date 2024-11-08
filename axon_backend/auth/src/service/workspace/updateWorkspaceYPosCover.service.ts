import { WorkspaceRepository } from "../../repository/workspace.repository.js";
import axonResponse from "../../utils/axonResponse.js";

const workspaceRepo = new WorkspaceRepository();
const updateWorkspaceYPosCoverService = async (
	userId: string,
	workspaceId: string,
	yPos: number,
) => {
	try {
		const { isError, workspace } =
			await workspaceRepo.updateWorkspaceCoverYPosition(
				userId,
				workspaceId,
				yPos,
			);

		if (isError.error) {
			return axonResponse(400, {
				message: isError.errorMessage,
				status: "error",
				data: null,
			});
		}

		return axonResponse(201, {
			message: "updated the workspace cover y position",
			status: "success",
			data: workspace?.coverPos,
		});
	} catch (error) {
		if (error instanceof Error) {
			console.log(`Error in updateWorkspaceYPosCoverService ${error.message}`);
			throw new Error(
				`Error in updateWorkspaceYPosCoverService ${error.message}`,
			);
		}
		console.log(`Error in updateWorkspaceYPosCoverService ${error}`);
		throw new Error(`Error in updateWorkspaceYPosCoverService ${error}`);
	}
};

export default updateWorkspaceYPosCoverService;
