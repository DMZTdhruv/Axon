import type { TAuthUser, TNavigationWorkspaceContent } from "@/types";
import type { JSONContent } from "novel";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

type TNavigationWorkspace = {
	_id: string;
	title: string;
	icon: string;
	cover: string;
	workspace: "axon" | "axonverse";
};

type TPrivileges = {
	_id: string;
	role: "owner" | "visitor";
};

type TCreatedBy = TAuthUser & {
	createdAt: string;
	updatedAt: string;
};

export type TContent = {
	_id: string;
	block: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	blockContent: any;
	bold: boolean;
	italic: boolean;
	createdAt: string;
	updatedAt: string;
	createdBy: TCreatedBy;
};

export interface IUserWorkspace {
	_id: string;
	title: string;
	icon: string | undefined;
	cover: string | undefined;
	coverPos: number;
	workspace: "main" | "axonverse";
	private: boolean;
	members: TAuthUser[] | null;
	parentPageId: string | null;
	privileges: TPrivileges | null;
	subPages: IUserWorkspace[];
	createdBy: string;
	content: JSONContent | undefined;
}

export interface WorkspaceStore {
	data: {
		main: IUserWorkspace[];
		axonverse: IUserWorkspace[];
	};
}

interface IUserWorkspaceStore {
	workspace: {
		main: IUserWorkspace[] | null;
		axonverse: IUserWorkspace[] | null;
		recent: TNavigationWorkspaceContent[] | null;
	};
	creatingParentWorkspaceLoading: boolean;
	creatingSubWorkspaceLoading: boolean;
	errorCreatingParentWorkspace: string;
	errorCreatingSubWorkspace: string;
	addMainWorkspaces: (mainWorkspaces: IUserWorkspace[]) => void;
	addAxonverseWorkspaces: (mainWorkspaces: IUserWorkspace[]) => void;
	addNewRecentWorkspace: (
		workspaceId: string,
		workspaceType: string,
		workspaceTitle: string,
		workspaceIcon: string,
		workspaceCover: string,
	) => void;
	addNewParentWorkspace: (
		workspaceType: "main" | "axonverse",
		userId: string,
	) => { newWorkspaceId: string; newWorkspaceType: "main" | "axonverse" };
	updateWorkspaceTitleById: (
		workspaceId: string,
		title: string,
		workspaceType: string,
	) => void;
	updateWorkspaceContent: (
		workspaceId: string,
		workspaceType: string,
		content: JSONContent,
	) => void;
	updateWorkspaceCover: (
		workspaceId: string,
		workspaceType: string,
		workspaceCover: string,
	) => void;
	updateWorkspaceCoverYPosition: (
		workspaceId: string,
		workspaceType: string,
		yPos: number,
	) => void;
	addNewSubWorkspaceById: (
		workspaceId: string,
		userId: string,
		workspaceType: "main" | "axonverse",
	) => void;
	removeWorkspace: (
		workspaceId: string,
		workspaceType: "main" | "axonverse",
	) => void;
	pushWorkspaceToDifferentWorkspace: (
		currentWorkspaceId: string,
		toWorkspaceId: string,
		workspaceType: "main" | "axonverse",
		toWorkspaceType: "main" | "axonverse",
	) => void;
}

export const useWorkspaceStore = create<IUserWorkspaceStore>((set) => ({
	workspace: {
		main: [],
		axonverse: [],
		recent: [],
	},
	creatingParentWorkspaceLoading: false,
	creatingSubWorkspaceLoading: false,
	errorCreatingParentWorkspace: "",
	errorCreatingSubWorkspace: "",

	addMainWorkspaces(mainWorkspaces) {
		set((state) => ({
			workspace: {
				...state.workspace,
				main: mainWorkspaces,
			},
		}));
	},
	addAxonverseWorkspaces(axonverseWorkspaces) {
		set((state) => ({
			workspace: {
				...state.workspace,
				axonverse: axonverseWorkspaces,
			},
		}));
	},

	updateWorkspaceTitleById: (
		workspaceId: string,
		title: string,
		workspaceType: string,
	) => {
		if (title.trim().length === 0) return;
		if (workspaceType === "main") {
			set((state) => ({
				workspace: {
					...state.workspace,
					main: state.workspace.main
						? updateWorkspaceTitleById(state.workspace.main, workspaceId, title)
						: state.workspace.main,
				},
			}));
		} else {
			set((state) => ({
				workspace: {
					...state.workspace,
					axonverse: state.workspace.axonverse
						? updateWorkspaceTitleById(
								state.workspace.axonverse,
								workspaceId,
								title,
							)
						: state.workspace.axonverse,
				},
			}));
		}
	},

	pushWorkspaceToDifferentWorkspace: (
		currentWorkspaceId: string,
		toWorkspaceId: string,
		workspaceType: "main" | "axonverse",
		toWorkspaceType: "main" | "axonverse",
	) => {
		set((state) => {
			if (state.workspace[workspaceType]) {
				const findWorkspaceAndRemove = (
					workspaces: IUserWorkspace[],
					currentWorkspaceId: string,
				): IUserWorkspace | undefined => {
					// Check if the workspace is at the top level
					const topLevelIndex = workspaces.findIndex(
						(w) => w._id === currentWorkspaceId,
					);
					if (topLevelIndex !== -1) {
						return workspaces.splice(topLevelIndex, 1)[0];
					}

					// If not at top level, search in subPages
					for (let i = 0; i < workspaces.length; i++) {
						if (workspaces[i].subPages && workspaces[i].subPages.length > 0) {
							const subWorkspace = findWorkspaceAndRemove(
								workspaces[i].subPages,
								currentWorkspaceId,
							);
							if (subWorkspace) return subWorkspace;
						}
					}
					return undefined;
				};

				const findToWorkspaceLocation = (
					workspaces: IUserWorkspace[],
					toWorkspaceId: string,
				): IUserWorkspace | undefined => {
					for (let i = 0; i < workspaces.length; i++) {
						if (workspaces[i]._id === toWorkspaceId) {
							return workspaces[i];
						}
						if (workspaces[i].subPages && workspaces[i].subPages.length > 0) {
							const subWorkspace = findToWorkspaceLocation(
								workspaces[i].subPages,
								toWorkspaceId,
							);
							if (subWorkspace) return subWorkspace;
						}
					}
					return undefined;
				};

				// Create a new copy of the source workspace array
				const sourceWorkspaces = [...state.workspace[workspaceType]];

				const workspaceToMove = findWorkspaceAndRemove(
					sourceWorkspaces,
					currentWorkspaceId,
				);

				if (!workspaceToMove) {
					return state;
				}

				workspaceToMove.workspace = toWorkspaceType;
				const updateWorkspaceType = (
					workspace: IUserWorkspace,
					newType: "main" | "axonverse",
				) => {
					workspace.workspace = newType;
					if (workspace.subPages && workspace.subPages.length > 0) {
						// biome-ignore lint/complexity/noForEach: <explanation>
						workspace.subPages.forEach((subPage) =>
							updateWorkspaceType(subPage, newType),
						);
					}
				};

				updateWorkspaceType(workspaceToMove, toWorkspaceType);

				const newWorkspaceState = {
					...state.workspace,
					[workspaceType]: sourceWorkspaces, // Use the modified source array
					[toWorkspaceType]: state.workspace[toWorkspaceType]
						? [...state.workspace[toWorkspaceType]]
						: [],
				};

				const newWorkspaceLocation = findToWorkspaceLocation(
					newWorkspaceState[toWorkspaceType] || [],
					toWorkspaceId,
				);

				if (!newWorkspaceLocation) {
					// If no destination workspace found, add to the top level of the destination type
					newWorkspaceState[toWorkspaceType]?.push(workspaceToMove);
				} else {
					newWorkspaceLocation.subPages = [
						workspaceToMove,
						...(newWorkspaceLocation.subPages || []),
					];
				}

				return {
					...state,
					workspace: newWorkspaceState,
				};
			}
			return { ...state };
		});
	},

	addNewRecentWorkspace: (
		workspaceId,
		workspaceType,
		workspaceTitle,
		workspaceIcon,
		workspaceCover,
	) => {
		const newVisitedWorkspace: TNavigationWorkspaceContent = {
			_id: workspaceId,
			icon: workspaceIcon,
			cover: workspaceCover,
			title: workspaceTitle,
			workspaceType: workspaceType,
		};

		set((state) => ({
			workspace: {
				...state.workspace,
				recent: state.workspace.recent
					? state.workspace.recent.length < 5
						? [newVisitedWorkspace, ...state.workspace.recent]
						: [newVisitedWorkspace, ...state.workspace.recent.slice(0, -1)]
					: [newVisitedWorkspace],
			},
		}));
	},

	addNewParentWorkspace: (workspaceType, userId) => {
		const newWorkspace: IUserWorkspace = {
			_id: uuidv4(),
			title: "Untitled",
			icon: "axon_logo.svg",
			cover: "",
			private: true,
			workspace: workspaceType,
			coverPos: 50,
			members: null,
			parentPageId: null,
			privileges: null,
			createdBy: userId,
			content: undefined,
			subPages: [],
		};
		if (workspaceType === "main") {
			set((state) => ({
				workspace: {
					...state.workspace,
					main: state.workspace.main
						? [newWorkspace, ...state.workspace.main]
						: [newWorkspace],
				},
			}));
		} else {
			set((state) => ({
				workspace: {
					...state.workspace,
					axonverse: state.workspace.axonverse
						? [newWorkspace, ...state.workspace.axonverse]
						: [newWorkspace],
				},
			}));
		}

		return {
			newWorkspaceId: newWorkspace._id,
			newWorkspaceType: newWorkspace.workspace,
		};
	},

	addParentNavigation() {},

	addNewSubWorkspaceById: (
		workspaceId: string,
		userId: string,
		workspaceType: "main" | "axonverse",
	) => {
		if (workspaceType === "main") {
			set((state) => ({
				workspace: {
					...state.workspace,
					main: state.workspace.main
						? addNewSubWorkspaceToParent(
								state.workspace.main,
								userId,
								workspaceId,
								workspaceType,
							)
						: state.workspace.main,
				},
			}));
		} else {
			set((state) => ({
				workspace: {
					...state.workspace,
					axonverse: state.workspace.axonverse
						? addNewSubWorkspaceToParent(
								state.workspace.axonverse,
								userId,
								workspaceId,
								workspaceType,
							)
						: state.workspace.axonverse,
				},
			}));
		}
	},

	removeWorkspace: (
		workspaceId: string,
		workspaceType: "main" | "axonverse",
	) => {
		if (workspaceType === "main") {
			set((state) => ({
				workspace: {
					...state.workspace,
					main: state.workspace.main
						? removeWorkspaceById(state.workspace.main, workspaceId)
						: state.workspace.main,
				},
			}));
		} else {
			set((state) => ({
				workspace: {
					...state.workspace,
					axonverse: state.workspace.axonverse
						? removeWorkspaceById(state.workspace.axonverse, workspaceId)
						: state.workspace.axonverse,
				},
			}));
		}
	},

	updateWorkspaceContent: (
		workspaceId: string,
		workspaceType: string,
		content: JSONContent,
	) => {
		if (workspaceType === "main") {
			set((state) => ({
				workspace: {
					...state.workspace,
					main: state.workspace.main
						? updateWorkspaceContentById(
								state.workspace.main,
								workspaceId,
								content,
							)
						: state.workspace.main,
				},
			}));
		} else {
			set((state) => ({
				workspace: {
					...state.workspace,
					axonverse: state.workspace.axonverse
						? updateWorkspaceContentById(
								state.workspace.axonverse,
								workspaceId,
								content,
							)
						: state.workspace.axonverse,
				},
			}));
		}
	},

	updateWorkspaceCover: (
		workspaceId: string,
		workspaceType: string,
		workspaceCover: string,
	) => {
		console.log(workspaceCover);
		if (workspaceType === "main") {
			set((state) => ({
				workspace: {
					...state.workspace,
					main: state.workspace.main
						? updateWorkspaceCoverById(
								state.workspace.main,
								workspaceId,
								workspaceCover,
							)
						: state.workspace.main,
				},
			}));
		} else {
			set((state) => ({
				workspace: {
					...state.workspace,
					axonverse: state.workspace.axonverse
						? updateWorkspaceCoverById(
								state.workspace.axonverse,
								workspaceId,
								workspaceCover,
							)
						: state.workspace.axonverse,
				},
			}));
		}
	},

	updateWorkspaceCoverYPosition: (
		workspaceId: string,
		workspaceType: string,
		yPosition: number,
	) => {
		if (workspaceType === "main") {
			set((state) => ({
				workspace: {
					...state.workspace,
					main: state.workspace.main
						? updateWorkspaceYPositionById(
								state.workspace.main,
								workspaceId,
								yPosition,
							)
						: state.workspace.main,
				},
			}));
		} else {
			set((state) => ({
				workspace: {
					...state.workspace,
					axonverse: state.workspace.axonverse
						? updateWorkspaceYPositionById(
								state.workspace.axonverse,
								workspaceId,
								yPosition,
							)
						: state.workspace.axonverse,
				},
			}));
		}
	},
}));

const updateWorkspaceYPositionById = (
	workspaces: IUserWorkspace[],
	workspaceId: string,
	yPos: number,
): IUserWorkspace[] => {
	return workspaces.map((workspace) => {
		if (workspace._id === workspaceId) {
			return {
				...workspace,
				coverPos: yPos,
			};
		}

		if (workspace.subPages) {
			return {
				...workspace,
				subPages: updateWorkspaceYPositionById(
					workspace.subPages,
					workspaceId,
					yPos,
				),
			};
		}

		return workspace;
	});
};

const updateWorkspaceContentById = (
	workspaces: IUserWorkspace[],
	workspaceId: string,
	content: JSONContent,
): IUserWorkspace[] => {
	return workspaces.map((workspace) => {
		if (workspace._id === workspaceId) {
			return {
				...workspace,
				content: content,
			};
		}

		if (workspace.subPages) {
			return {
				...workspace,
				subPages: updateWorkspaceContentById(
					workspace.subPages,
					workspaceId,
					content,
				),
			};
		}

		return workspace;
	});
};

const updateWorkspaceCoverById = (
	workspaces: IUserWorkspace[],
	workspaceId: string,
	cover: string,
): IUserWorkspace[] => {
	return workspaces.map((workspace) => {
		if (workspace._id === workspaceId) {
			return {
				...workspace,
				cover,
			};
		}

		if (workspace.subPages) {
			return {
				...workspace,
				subPages: updateWorkspaceCoverById(
					workspace.subPages,
					workspaceId,
					cover,
				),
			};
		}

		return workspace;
	});
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

const removeWorkspaceById = (
	workspaces: IUserWorkspace[],
	workspaceId: string,
): IUserWorkspace[] => {
	return workspaces.reduce((acc: IUserWorkspace[], workspace) => {
		if (workspace._id === workspaceId) {
			return acc;
		}

		if (workspace.subPages) {
			return [
				// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
				...acc,
				{
					...workspace,
					subPages: removeWorkspaceById(workspace.subPages, workspaceId),
				},
			];
		}

		// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
		return [...acc, workspace];
	}, []);
};

const addNewSubWorkspaceToParent = (
	workspaces: IUserWorkspace[],
	userId: string,
	workspaceId: string,
	workspaceType: "main" | "axonverse",
): IUserWorkspace[] => {
	const newWorkspace: IUserWorkspace = {
		_id: Math.random().toString(36).substring(2, 9),
		title: "Untitled",
		icon: "axon_logo.svg",
		cover: undefined,
		private: true,
		coverPos: 50,
		workspace: workspaceType,
		members: null,
		createdBy: userId,
		parentPageId: workspaceId,
		privileges: null,
		content: undefined,
		subPages: [],
	};

	return workspaces.map((workspace) => {
		if (workspace._id === workspaceId) {
			return {
				...workspace,
				subPages: [newWorkspace, ...workspace.subPages],
			};
		}
		if (workspace.subPages) {
			return {
				...workspace,
				subPages: addNewSubWorkspaceToParent(
					workspace.subPages,
					userId,
					workspaceId,
					workspaceType,
				),
			};
		}
		return workspace;
	});
};
