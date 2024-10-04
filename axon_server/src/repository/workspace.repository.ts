import { Workspace } from "../models/workspace.model.js";
import type {
	ErrorMessageReturn,
	IWorkspace,
	TPrivileges,
} from "../types/types.js";
import { errorMessage } from "../validators/errorResponse.js";

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
		});
	}

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

	// async getWorkspaceById(
	// 	workspaceId: string,
	// 	userId: string,
	// ): Promise<IWorkspace | null> {
	// 	const workspace = await Workspace.find({
	// 		_id: workspaceId,
	// 		workspace: "main",
	// 		"privileges.userId": userId,
	// 	}).populate("subPages");
	// 	if (!workspace) return null;

	// 	const populatedSubPages = await Promise.all(
	// 		(workspace.subPages as IWorkspace[]).map(async (subPage) => {
	// 			const sbPage = await this.getWorkspaceById(subPage._id,userId);
	// 			return sbPage;
	// 		}),
	// 	);

	// 	workspace.subPages = populatedSubPages.filter((page) => page !== null);
	// 	return workspace;
	// }

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

		const deletedWorkspace = await Workspace.findByIdAndDelete(workspaceId);

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
}
