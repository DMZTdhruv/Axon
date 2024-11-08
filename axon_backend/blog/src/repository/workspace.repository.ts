import User from "../models/user.model.js";
import { Workspace, WorkspaceContent } from "../models/workspace.model.js";
import type {
	ErrorMessageReturn,
	IContent,
	IWorkspace,
	TPrivileges,
} from "../types/types.js";
import { checkIfUserIsPrivileged } from "../utils/workspace.utils.js";
import { errorMessage } from "../validators/errorResponse.js";
import { SanityRepository } from "./sanity.repository.js";
import { UserRepository } from "./user.repository.js";

type CreateWorkspaceTypes = {
	createdBy: string;
	workspace: "main" | "axonverse";
	_id: string;
};

type GetAllWorkspaceByUserId = {
	main: IWorkspace[];
	axonverse: IWorkspace[];
};

type UpdatedWorkspaceTitle = {
	isError: ErrorMessageReturn;
	workspace: IWorkspace | null;
};

type DeleteWorkspaceById = {
	isError: ErrorMessageReturn;
	workspace: IWorkspace | null;
};

type CommonWorkspaceReturn = {
	isError: ErrorMessageReturn;
	workspace: IWorkspace | null;
};

type CommonWorkspaceContentReturn = {
	isError: ErrorMessageReturn;
	content: IContent | null;
};

// type GetWorkspaceWithPrivilegesReturn = {
// 	workspace: IWorkspace | null;
// 	isError: boolean;
// 	errorMessage: string;
// };
type PushWorkspace = {
	currentWorkspaceId: string;
	toWorkspaceId: string;
	toWorkspaceType: "axonverse" | "main";
	userId: string;
};

type CreateSubWorkspace = {
	_id: string;
	parentPageId: string;
	workspace: string;
	createdBy: string;
};

const sanityRepo = new SanityRepository();
const userRepo = new UserRepository();
export class WorkspaceRepository {
	async createWorkspace({ _id, workspace, createdBy }: CreateWorkspaceTypes) {
		const privileges: TPrivileges = {
			userId: createdBy,
			role: "owner",
		};

		const newWorkspace = new Workspace({
			_id: _id,
			createdBy: createdBy,
			workspace: workspace,
		});
		newWorkspace.privileges.push(privileges);

		return await newWorkspace.save();
	}

	async getMainWorkspaces(userId: string): Promise<IWorkspace[]> {
		return await Workspace.find({
			parentPageId: null,
			"privileges.userId": userId,
			workspace: "main",
		}).select("-content");
	}

	async createSubWorkspace({
		_id,
		workspace,
		parentPageId,
		createdBy,
	}: CreateSubWorkspace) {
		const parentWorkspace = await Workspace.findById(parentPageId);
		const privileges: TPrivileges = {
			userId: createdBy,
			role: "owner",
		};

		if (!parentWorkspace) {
			return {
				isError: errorMessage(true, "parent workspace doesn't exist"),
				workspace: null,
			};
		}

		const isUserPrivileged = checkIfUserIsPrivileged(
			parentWorkspace.privileges,
			createdBy,
		);

		if (isUserPrivileged.error) {
			return {
				isError: errorMessage(true, isUserPrivileged.errorMessage),
				workspace: null,
			};
		}

		const newWorkspace = new Workspace({
			_id: _id,
			createdBy: createdBy,
			workspace: workspace,
			parentPageId: parentWorkspace?._id,
		});

		newWorkspace.privileges.push(privileges);
		const subWorkspaceInstance = await newWorkspace.save();
		//@ts-ignore
		parentWorkspace.subPages?.push(subWorkspaceInstance._id);
		await parentWorkspace.save();

		return {
			isError: errorMessage(false, ""),
			workspace: newWorkspace,
		};
	}

	async pushWorkspace({
		userId,
		currentWorkspaceId,
		toWorkspaceId,
		toWorkspaceType,
	}: PushWorkspace): Promise<CommonWorkspaceReturn> {
		// User profile to later update the main and axonverse workspaces objects
		const userProfile = await User.findById(userId);
		if (!userProfile)
			return {
				isError: errorMessage(true, "user doesn't exist"),
				workspace: null,
			};

		// workspace which we are going to move
		const workspaceToMove = await Workspace.findById(currentWorkspaceId);
		if (!workspaceToMove)
			return {
				isError: errorMessage(true, "current workspace doesn't exist"),
				workspace: null,
			};

		// the destination where we move our workspace
		const moveToWorkspace = await Workspace.findById(toWorkspaceId);
		if (!moveToWorkspace)
			return {
				isError: errorMessage(true, "destination workspace doesn't exist"),
				workspace: null,
			};

		// if the workspace which we are moving has the parent page id, then we know that it is a sub workspace
		if (workspaceToMove?.parentPageId) {
			// in that case we remove the workspace id which we are moving from the parent workspace
			// cause ofc we are moving, so this parent loses it's children as someone else is gonna adopt it xD
			await Workspace.findByIdAndUpdate(workspaceToMove.parentPageId, {
				$pull: { subPages: workspaceToMove._id },
			});
		} else if (workspaceToMove.parentPageId === null) {
			// if the workspace we are moving is a parent workspace then we need to remove it from the user Profile
			const workspaceType = workspaceToMove.workspace;
			userProfile.workspaces[workspaceType] = userProfile.workspaces[
				workspaceType
			].filter(
				(id) => id.toString() !== workspaceToMove._id.toString(),
			) as string[];

			await userProfile.save();
		}

		// now we need to make sure that we move our workspace to it's destination
		moveToWorkspace.subPages.push(workspaceToMove._id as IWorkspace & string);
		moveToWorkspace.save();

		// If the workspace was a parent (top-level) workspace and is moving to a different type,
		// add it to the appropriate array in the user profile
		if (
			!workspaceToMove.parentPageId &&
			workspaceToMove.workspace !== toWorkspaceType
		) {
			userProfile.workspaces[toWorkspaceType].push(
				workspaceToMove._id as string & IWorkspace,
			);
		}

		// Great so far we have removed the old location and updated the new location
		// but there is a catch we also need to update the workspaceType for each workspace which we moved and also the sub workspace
		// recursion will help us
		await this.changeTheSubWorkspaceType(
			toWorkspaceType,
			workspaceToMove._id,
			moveToWorkspace._id,
		);
		return {
			isError: errorMessage(false, "workspace moved successfully"),
			workspace: null,
		};
	}

	async changeTheSubWorkspaceType(
		toWorkspaceType: "axonverse" | "main",
		workspaceId: string,
		destinationWorkspaceId: string,
	) {
		// find the current workspace and parent workspace
		const [workspace, destinationWorkspace] = await Promise.all([
			Workspace.findById(workspaceId),
			Workspace.findById(destinationWorkspaceId),
		]);

		// If either workspace is not found, return
		if (!workspace || !destinationWorkspace) return;

		// Update the workspace type to the specified type
		workspace.workspace = toWorkspaceType;
		workspace.parentPageId = destinationWorkspace._id;

		// If the workspace has sub-workspaces, recursively update their types
		if (workspace.subPages && workspace.subPages.length > 0) {
			const subWorkspacesPromise = workspace.subPages.map((sub) =>
				this.changeTheSubWorkspaceType(
					toWorkspaceType,
					sub.toString(),
					workspace._id,
				),
			);
			await Promise.all(subWorkspacesPromise);
		}

		// Save the updated workspace
		await workspace.save();
	}

	// update workspace
	async updateWorkspaceCover(
		userId: string,
		workspaceCover: string,
		workspaceId: string,
	) {
		const workspace = await this.getWorkspaceById(workspaceId);

		if (!workspace) {
			return {
				isError: errorMessage(true, "Workspace doesn't exist"),
				workspace: null,
			};
		}

		const privilegedUser = workspace.privileges.find(
			(user) => user.userId.toString() === userId,
		);

		if (privilegedUser?.role === "owner" || privilegedUser?.role === "friend") {
			console.log("Hello world");

			workspace.cover = workspaceCover;
			const updatedWorkspace = await workspace.save();
			console.log(workspace.cover);

			return {
				isError: errorMessage(false, ""),
				workspace: updatedWorkspace,
			};
		}

		return {
			isError: errorMessage(
				true,
				"User does not have authority to edit the workspace",
			),
			workspace: null,
		};
	}

	async updateWorkspaceIcon(
		iconName: string | null,
		userId: string,
		workspaceId: string,
	): Promise<CommonWorkspaceReturn> {
		const workspace = await Workspace.findById(workspaceId);
		if (!workspace) {
			return {
				isError: errorMessage(true, "workspace doesn't exist"),
				workspace: null,
			};
		}

		const { error, errorMessage: privilegedError } = checkIfUserIsPrivileged(
			workspace.privileges,
			userId,
		);
		if (error) {
			return {
				isError: errorMessage(true, privilegedError),
				workspace: null,
			};
		}

		workspace.icon = iconName;
		await workspace.save();
		return {
			isError: errorMessage(false, "workspace icon updated successfully"),
			workspace: null,
		};
	}

	async updateWorkspaceCoverYPosition(
		userId: string,
		workspaceId: string,
		yPos: number,
	): Promise<CommonWorkspaceReturn> {
		const workspace = await Workspace.findById(workspaceId);
		if (!workspace) {
			return {
				isError: errorMessage(true, "workspace doesn't exist"),
				workspace: null,
			};
		}
		const { error, errorMessage: privilegedError } = checkIfUserIsPrivileged(
			workspace.privileges,
			userId,
		);
		if (error) {
			return {
				isError: errorMessage(true, privilegedError),
				workspace: null,
			};
		}

		workspace.coverPos = yPos;
		await workspace.save();
		return {
			isError: errorMessage(false, ""),
			workspace: null,
		};
	}

	async updateWorkspaceTitleById(
		userId: string,
		title: string,
		workspaceId: string,
	): Promise<UpdatedWorkspaceTitle> {
		const workspace = await this.getWorkspaceById(workspaceId);

		if (!workspace) {
			return {
				isError: errorMessage(true, "Workspace doesn't exist"),
				workspace: null,
			};
		}

		const privilegedUser = workspace.privileges.find(
			(user) => user.userId.toString() === userId,
		);

		if (privilegedUser?.role === "owner" || privilegedUser?.role === "friend") {
			console.log("Hello world");

			workspace.title = title.trim();
			const updatedWorkspace = await workspace.save();
			console.log(updatedWorkspace);

			return {
				isError: errorMessage(false, ""),
				workspace: updatedWorkspace,
			};
		}

		return {
			isError: errorMessage(
				true,
				"User does not have authority to edit the workspace",
			),
			workspace: null,
		};
	}

	async updateWorkspaceWidth(
		userId: string,
		workspaceId: string,
		width: "sm" | "lg",
	): Promise<CommonWorkspaceReturn> {
		const workspace = await this.getWorkspaceById(workspaceId);
		if (!workspace) {
			return {
				isError: errorMessage(true, "Workspace not found"),
				workspace: null,
			};
		}
		const isUserPrivileged = checkIfUserIsPrivileged(
			workspace.privileges,
			userId,
		);

		if (isUserPrivileged.error) {
			return {
				isError: errorMessage(true, isUserPrivileged.errorMessage),
				workspace: null,
			};
		}

		workspace.workspaceWidth = width;
		const updatedWorkspace = await workspace.save();
		return {
			isError: errorMessage(false, ""),
			workspace: updatedWorkspace,
		};
	}

	async getWorkspaceById(workspaceId: string): Promise<IWorkspace | null> {
		return await Workspace.findById(workspaceId);
	}

	async getAxonVerseWorkspaces(userId: string): Promise<IWorkspace[]> {
		return await Workspace.find({
			parentPageId: null,
			"privileges.userId": userId,
			workspace: "axonverse",
		});
	}

	async getWorkspacesByUserId(
		userId: string,
	): Promise<GetAllWorkspaceByUserId> {
		const promises = [
			this.getMainWorkspaces(userId),
			this.getAxonVerseWorkspaces(userId),
		];
		const workspaces = await Promise.all(promises);
		const organizedWorkspaces: GetAllWorkspaceByUserId = {
			main: workspaces[0],
			axonverse: workspaces[1],
		};

		//later also return the subPages
		return organizedWorkspaces;
	}

	async fetchAllWorkspace(userId: string) {
		const mainWorkspacePromises = this.populateWorkspaceWithSubWorkspace(
			userId,
			"main",
		);
		const axonverseWorkspacePromises = this.populateWorkspaceWithSubWorkspace(
			userId,
			"axonverse",
		);
		const promises = [mainWorkspacePromises, axonverseWorkspacePromises];

		const allWorkspaces = await Promise.all(promises);
		const organizedWorkspaces = {
			main: allWorkspaces[0],
			axonverse: allWorkspaces[1],
		};
		return organizedWorkspaces;
	}

	async populateWorkspaceWithSubWorkspace(
		userId: string,
		workspaceType: "main" | "axonverse",
	) {
		const user = await User.findById(userId).select("-password");
		if (!user) return null;

		const promises: Promise<IWorkspace | null>[] = [];
		for (const workspace of user.workspaces[workspaceType]) {
			const promise = this.populateWorkspaceWithSubPages(workspace as string);
			promises.push(promise);
		}
		const populatedWorkspaceResult = await Promise.all(promises);
		return populatedWorkspaceResult.reverse();
	}

	async populateWorkspaceWithSubPages(workspaceId: string) {
		const workspace = await Workspace.findById(workspaceId).populate({
			path: "subPages",
		});
		if (!workspace) return null;
		await this.recursivePopulate(workspace);
		return workspace;
	}

	async recursivePopulate(workspace: IWorkspace) {
		if (!workspace.subPages || workspace.subPages.length === 0) return;

		const populatedSubPages = await Workspace.populate(workspace, {
			path: "subPages",
		});

		if (populatedSubPages.subPages) {
			const promises = populatedSubPages.subPages.map(async (subPage) => {
				if (subPage) {
					return this.recursivePopulate(subPage as IWorkspace);
				}
			});

			await Promise.all(promises);
		}
	}

	async deleteWorkspaces(
		userId: string,
		workspaceId: string,
	): Promise<CommonWorkspaceReturn> {
		const workspace = await Workspace.findById(workspaceId);
		if (!workspace) {
			return {
				isError: errorMessage(true, "Workspace not found"),
				workspace: null,
			};
		}

		const isUserPrivileged = checkIfUserIsPrivileged(
			workspace.privileges,
			userId,
		);

		if (isUserPrivileged.error) {
			return {
				isError: errorMessage(true, isUserPrivileged.errorMessage),
				workspace: null,
			};
		}

		if (workspace.subPages && workspace.subPages.length > 0) {
			const promises = workspace.subPages.map((workspaceId) => {
				return this.deleteWorkspaces(userId, workspaceId as string);
			});

			await Promise.all(promises);
		}

		if (workspace.parentPageId === null) {
			const { error, errorMessage: errorMsgRmWorkspace } =
				await userRepo.removeWorkspaceFromUser(
					workspaceId,
					userId,
					workspace.workspace,
				);
			if (error) {
				return {
					isError: errorMessage(error, errorMsgRmWorkspace),
					workspace: null,
				};
			}
		}

		await this.deleteWorkspaceById(userId, workspaceId);
		return {
			isError: errorMessage(false, ""),
			workspace: null,
		};
	}

	async deleteWorkspaceById(
		userId: string,
		workspaceId: string,
	): Promise<DeleteWorkspaceById> {
		const workspace = await this.getWorkspaceById(workspaceId);

		if (!workspace) {
			return {
				isError: errorMessage(true, "Workspace not found"),
				workspace: null,
			};
		}

		if (workspace.createdBy.toString() !== userId) {
			return {
				isError: errorMessage(
					true,
					"User is not authorized to delete this workspace",
				),
				workspace: null,
			};
		}

		await sanityRepo.deleteImages(workspaceId);
		console.log(`Images deleted for the ${workspaceId}`);

		await this.deleteWorkspaceContentByWorkspaceId(workspaceId);
		console.log(`workspace content deleted for: ${workspaceId}`);

		const deletedWorkspace = await Workspace.findByIdAndDelete(workspaceId);
		console.log(`workspace with ${workspaceId} was successfully deleted`);

		if (!deletedWorkspace) {
			return {
				isError: errorMessage(true, "Failed to delete workspace"),
				workspace: null,
			};
		}

		return {
			isError: errorMessage(false, ""),
			workspace: deletedWorkspace,
		};
	}

	async removeCover(
		userId: string,
		workspaceId: string,
	): Promise<CommonWorkspaceReturn> {
		const workspace = await Workspace.findById(workspaceId);
		if (!workspace) {
			return {
				isError: errorMessage(true, "Workspace not found"),
				workspace: null,
			};
		}

		const isUserPrivileged = checkIfUserIsPrivileged(
			workspace.privileges,
			userId,
		);

		if (isUserPrivileged.error) {
			return {
				isError: errorMessage(true, isUserPrivileged.errorMessage),
				workspace: null,
			};
		}

		await sanityRepo.deleteImages(workspaceId);
		return {
			isError: errorMessage(false, ""),
			workspace: null,
		};
	}

	async updateWorkspaceContent(
		workspaceId: string,
		// biome-ignore lint/complexity/noBannedTypes: <explanation>
		content: Object,
		userId: string,
	): Promise<CommonWorkspaceReturn> {
		const workspace = await this.getWorkspaceById(workspaceId);

		if (!workspace) {
			return {
				isError: errorMessage(true, "Workspace not found"),
				workspace: null,
			};
		}

		const isUserPrivileged = checkIfUserIsPrivileged(
			workspace.privileges,
			userId,
		);

		if (isUserPrivileged.error) {
			return {
				isError: errorMessage(true, isUserPrivileged.errorMessage),
				workspace: null,
			};
		}

		if (workspace.content) {
			const workspaceContent = await this.getWorkspaceContentById(
				workspace.content,
			);

			if (workspaceContent) {
				workspaceContent.content = content;
				await workspaceContent.save();
				return {
					isError: errorMessage(false, ""),
					workspace: workspace,
				};
			}
		}

		const newContent = new WorkspaceContent({
			createdBy: workspace.createdBy,
			content,
			workspaceId: workspace._id,
		});

		try {
			const contentInstance = await newContent.save();
			if (contentInstance) {
				workspace.content = contentInstance._id as string;
				await workspace.save();
			}

			return {
				isError: errorMessage(false, ""),
				workspace: workspace,
			};
		} catch (error) {
			return {
				isError: errorMessage(true, "Failed to save new content"),
				workspace: null,
			};
		}
	}

	async deleteWorkspaceContentByWorkspaceId(workspaceId: string) {
		await WorkspaceContent.findOneAndDelete({ workspaceId: workspaceId });
	}

	async getWorkspaceContentByIdSecure(
		workspaceId: string,
		userId: string,
	): Promise<CommonWorkspaceContentReturn> {
		const workspace = await this.getWorkspaceById(workspaceId);

		if (!workspace) {
			return {
				isError: errorMessage(
					true,
					"Content for this workspace not found as workspace doesn't exist",
				),
				content: null,
			};
		}

		const isUserPrivileged = checkIfUserIsPrivileged(
			workspace.privileges,
			userId,
		);

		if (isUserPrivileged.error) {
			return {
				isError: errorMessage(true, isUserPrivileged.errorMessage),
				content: null,
			};
		}

		// if content available with the content id we return that content
		if (workspace.content) {
			const content = await this.getWorkspaceContentById(workspace.content);
			if (content) {
				return {
					isError: errorMessage(false, ""),
					content: content,
				};
			}
		}

		// if no content we don't return error but return null
		return {
			isError: errorMessage(false, "found"),
			content: null,
		};
	}

	async getWorkspaceContentById(contentId: string) {
		const content = WorkspaceContent.findById(contentId);
		return content;
	}
}
