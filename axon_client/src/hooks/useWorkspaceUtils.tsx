import { type IUserWorkspace, useWorkspaceStore } from "@/stores/workspace";

interface IRoutes {
	_id: string;
	title: string;
	workspace: string;
	parentPageId: string | null;
}

const useWorkspaceUtils = () => {
	const workspaces = useWorkspaceStore((state) => state.workspace);

	const findWorkspaceById = (
		workspaces: IUserWorkspace[],
		workspaceId: string,
	): IUserWorkspace | undefined => {
		for (const workspace of workspaces) {
			if (workspace._id === workspaceId) {
				return workspace;
			}
			if (workspace.subPages) {
				const foundedWorkspace = findWorkspaceById(
					workspace.subPages,
					workspaceId,
				);
				if (foundedWorkspace) {
					return foundedWorkspace;
				}
			}
		}
		return undefined;
	};

	const findWorkspace = (
		workspaceId: string,
		workspaceType: string,
	): IUserWorkspace | undefined => {
		if (workspaceType === "main") {
			return workspaces.main
				? findWorkspaceById(workspaces.main, workspaceId)
				: undefined;
		}
		return workspaces.axonverse
			? findWorkspaceById(workspaces.axonverse, workspaceId)
			: undefined;
	};

	const findRouteById = (
		workspaces: IUserWorkspace[],
		workspaceId: string,
	): IRoutes | undefined => {
		for (const workspace of workspaces) {
			if (workspace._id === workspaceId) {
				return {
					_id: workspace._id,
					title: workspace.title || "untitled",
					workspace: workspace.workspace,
					parentPageId: workspace.parentPageId,
				};
			}
			if (workspace.subPages) {
				const foundedWorkspace = findWorkspaceById(
					workspace.subPages,
					workspaceId,
				);
				if (foundedWorkspace) {
					return {
						_id: foundedWorkspace._id,
						title: foundedWorkspace.title || "untitled",
						workspace: workspace.workspace,
						parentPageId: foundedWorkspace.parentPageId,
					};
				}
			}
		}
		return undefined;
	};

	const findRoutes = (
		workspaceId: string,
		workspaceType: string,
	): IRoutes | undefined => {
		if (workspaceType === "main") {
			return workspaces.main
				? findRouteById(workspaces.main, workspaceId)
				: undefined;
		}
		return workspaces.axonverse
			? findRouteById(workspaces.axonverse, workspaceId)
			: undefined;
	};

	const updateWorkspaceTitleById = (
		workspaces: IUserWorkspace[],
		workspaceId: string,
		newTitle: string,
	): IUserWorkspace[] => {
		return workspaces.map((workspace) => {
			if (workspace._id === workspaceId) {
				return {
					...workspace,
					title: newTitle,
				};
			}

			if (workspace.subPages) {
				return {
					...workspace,
					subPages: updateWorkspaceTitleById(
						workspace.subPages,
						workspaceId,
						newTitle,
					),
				};
			}
			return workspace;
		});
	};

	return {
		findWorkspace,
		findRoutes,
		updateWorkspaceTitleById,
		findWorkspaceById,
		findRouteById,
	};
};

export default useWorkspaceUtils;
