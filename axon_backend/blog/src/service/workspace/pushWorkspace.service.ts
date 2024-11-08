import { WorkspaceRepository } from "../../repository/workspace.repository.js";
import axonResponse from "../../utils/axonResponse.js";

type PushWorkspaceService = {
	currentWorkspaceId: string;
	toWorkspaceId: string;
	toWorkspaceType: "axonverse" | "main";
	userId: string;
};

const workspaceRepo = new WorkspaceRepository();
const pushWorkspaceService = async ({
	currentWorkspaceId,
	toWorkspaceId,
	toWorkspaceType,
	userId,
}: PushWorkspaceService) => {
	try {
		const { isError } = await workspaceRepo.pushWorkspace({
			userId,
			toWorkspaceId,
			currentWorkspaceId,
			toWorkspaceType,
		});
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
			message: "successfully",
		});
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		}
		throw new Error("unknown error occurred");
	}
};

export default pushWorkspaceService;
