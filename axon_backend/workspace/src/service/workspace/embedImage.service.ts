import { UploadedFile } from "../../types/types.js";
import { SanityRepository } from "../../repository/sanity.repository.js";
import { Workspace, WorkspaceContent } from "../../models/workspace.model.js";
import { checkIfUserIsPrivileged } from "../../utils/workspace.utils.js";
import axonResponse from "../../utils/axonResponse.js";

const sanityRepo = new SanityRepository();
export const embedImageService = async (
	userId: string,
	workspaceId: string,
	file: UploadedFile,
) => {
	try {
		const { url, imageId } = await sanityRepo.uploadImage({
			file,
			workspaceId,
			userId,
		});

		const workspace = await Workspace.findById(workspaceId);
		if (!workspace) {
			return axonResponse(400, {
				status: "error",
				message: "Workspace not found",
				data: null,
			});
		}
		const workspaceContent = await WorkspaceContent.findById(workspace.content);
		if (!workspaceContent) {
			return axonResponse(400, {
				status: "error",
				message: "Current Workspace content not found",
				data: null,
			});
		}

		const { error, errorMessage: privilegedError } = checkIfUserIsPrivileged(
			workspace.privileges,
			userId,
		);
		if (error) {
			return axonResponse(404, {
				status: "error",
				message: privilegedError,
				data: null,
			});
		}

		workspaceContent.imageId.push(imageId);
		await workspaceContent.save();

		return axonResponse(201, {
			status: "success",
			message: "embedded image successfully",
			data: url,
		});
	} catch (error) {
		throw new Error(error as string);
	}
};

export const deleteAllTheImagesOfWorkspace = async (workspaceId: string) => {
	try {
		const workspace = await Workspace.findById(workspaceId);
		if (!workspace) {
			return axonResponse(400, {
				status: "error",
				message: "Workspace not found",
				data: null,
			});
		}
		const workspaceContent = await WorkspaceContent.findById(workspace.content);
		if (!workspaceContent) {
			return axonResponse(400, {
				status: "error",
				message: "Current Workspace content not found",
				data: null,
			});
		}
		await sanityRepo.deleteImageById(workspaceContent.imageId);
		return axonResponse(200, {
			status: "success",
			message: "Deleted  all the images for this workspace",
			data: null,
		});
	} catch (error) {
		throw new Error(error as string);
	}
};
