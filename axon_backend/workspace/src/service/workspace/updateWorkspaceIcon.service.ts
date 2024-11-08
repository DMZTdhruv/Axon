import { WorkspaceRepository } from "../../repository/workspace.repository.js";
import axonResponse from "../../utils/axonResponse.js";

const workspaceRepo = new WorkspaceRepository();
const updateWorkspaceIconService = async (
	iconName: string | null,
	workspaceId: string,
	userId: string,
) => {
	try {
		const { isError } = await workspaceRepo.updateWorkspaceIcon(
			iconName,
			userId,
			workspaceId,
		);

		if (isError.error) {
			return axonResponse(400, {
				status: "error",
				data: null,
				message: isError.errorMessage,
			});
		}

		return axonResponse(201, {
			status: "success",
			data: null,
			message: "changed the workspace Icon successfully",
		});

	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		}
		throw new Error("unknown error occurred");
	}
};

export default updateWorkspaceIconService;