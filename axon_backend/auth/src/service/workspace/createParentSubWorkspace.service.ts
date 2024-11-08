import { WorkspaceRepository } from "../../repository/workspace.repository.js";
import type { TCreateSubWorkspaceService } from "../../types/types.js";
import type { TAxonResponse } from "../../utils/axonResponse.js";
import axonResponse from "../../utils/axonResponse.js";

const workspaceRepo = new WorkspaceRepository();
export const createSubParentWorkspaceService = async ({
	_id,
	workspace,
	createdBy,
	parentPageId,
}: TCreateSubWorkspaceService): Promise<TAxonResponse> => {
	try {
		const { isError, workspace: subWorkspace } =
			await workspaceRepo.createSubWorkspace({
				_id,
				workspace,
				createdBy,
				parentPageId,
			});

		if (isError.error) {
			return axonResponse(400, {
				data: null,
				message: isError.errorMessage,
				status: "error",
			});
		}

		return axonResponse(201, {
			data: subWorkspace,
			message: "sub workspace created successfully",
			status: "success",
		});
	} catch (error) {
		if (error instanceof Error) {
			console.log(`Error in createSubParentWorkspaceService ${error.message}`);
			throw new Error(
				`Error in createSubParentWorkspaceService ${error.message}`,
			);
		}
		throw new Error("internal server error");
	}
};
