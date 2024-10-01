import { SanityRepository } from "../../repository/sanity.repository.js";
import type { UploadedFile } from "../../types.js";
import type { TAxonResponse } from "../../utils/axonResponse.js";
import axonResponse from "../../utils/axonResponse.js";

const sanityRepo = new SanityRepository();
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

		console.log({
			imageId,
			url,
		});

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
