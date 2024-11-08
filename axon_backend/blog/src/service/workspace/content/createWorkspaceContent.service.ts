import { WorkspaceRepository } from "../../../repository/workspace.repository.js";
import axonResponse from "../../../utils/axonResponse.js";

type CreateWorkspaceContentService = {
	userId: string;
	workspaceId: string;
	// biome-ignore lint/complexity/noBannedTypes: <explanation>
	content: Object;
};

const workspaceRepo = new WorkspaceRepository();
export default async function updateWorkspaceContentService({
	workspaceId,
	userId,
	content,
}: CreateWorkspaceContentService) {
	try {
		const { isError, workspace } = await workspaceRepo.updateWorkspaceContent(
			workspaceId,
			content,
			userId,
		);
		const { error, errorMessage } = isError;

		if (error) {
			return axonResponse(400, {
				data: null,
				message: errorMessage,
				status: "error",
			});
		}

		return axonResponse(201, {
			data: workspace,
			message: errorMessage,
			status: "success",
		});
	} catch (error) {
		if (error instanceof Error) {
			console.log(`Error in deleteWorkspaceService ${error.message}`);
			throw new Error(error.message);
		}
		console.log(error);
		throw new Error("An unknown error ocurred");
	}
}
