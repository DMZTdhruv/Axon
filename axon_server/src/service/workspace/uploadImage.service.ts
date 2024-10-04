import { SanityRepository } from "../../repository/sanity.repository.js";
import { WorkspaceRepository } from "../../repository/workspace.repository.js";
import type { UploadedFile } from "../../types/types.js";
import type { TAxonResponse } from "../../utils/axonResponse.js";
import axonResponse from "../../utils/axonResponse.js";

const sanityRepo = new SanityRepository();
const workspaceRepo = new WorkspaceRepository();
export const uploadImageService = async (
	userId: string,
	workspaceId: string,
	file: UploadedFile,
): Promise<TAxonResponse> => {
	try {
		const { uploadImage } = sanityRepo;
		// later add the logic to check if the uploaded is by the workspace owner or not when saving workspace in database
		const { imageId, url } = await uploadImage({
			file,
			workspaceId,
			userId,
		});

		const { isError } = await workspaceRepo.updateWorkspaceCover(
			userId,
			url,
			workspaceId,
		);
		if (isError.error) {
			return axonResponse(400, {
				success: false,
				message: "Image upload failed",
				data: null,
			});
		}

		return axonResponse(201, {
			success: true,
			message: "Image uploaded successfully",
			data: {
				imageId,
				url,
			},
		});
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Error in uploadImageService ${uploadImageService}`);
		}
		return axonResponse(401, {
			success: false,
			message: "Image upload failed.",
			data: null,
		});
	}
};
