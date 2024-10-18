import { UserRepository } from "../../repository/user.repository.js";
import { WorkspaceRepository } from "../../repository/workspace.repository.js";
import type { TCreateWorkspaceService } from "../../types/types.js";
import type { TAxonResponse } from "../../utils/axonResponse.js";
import axonResponse from "../../utils/axonResponse.js";

const workspaceRepo = new WorkspaceRepository();
const userRepo = new UserRepository();

export const createWorkspaceService = async ({
	_id,
	workspace,
	createdBy,
}: TCreateWorkspaceService): Promise<TAxonResponse> => {
	try {
		const newWorkspace = await workspaceRepo.createWorkspace({
			_id,
			workspace,
			createdBy,
		});

		console.log(newWorkspace);

		// pushing the workspaceId to the user main field in the user schema
		const pushedMainWorkspace = await userRepo.pushWorkspaceToUser(
			newWorkspace._id,
			createdBy,
			workspace,
		);

		// checking for any errors
		if (pushedMainWorkspace.error) {
			return axonResponse(400, {
				data: null,
				message: pushedMainWorkspace.errorMessage,
				status: "error",
			});
		}

		// returning the newly created workspace to the user
		return axonResponse(201, {
			data: newWorkspace,
			message: "workspace created successfully",
			status: "success",
		});
	} catch (error) {
		if (error instanceof Error) {
			console.log(`Error in createWorkspaceService ${error.message}`);
		}
		throw new Error("internal server error");
	}
};
