import WorkspaceCover from "@/components/workspace/WorkspaceCover";
import type { TAuthUser, TNavigationWorkspaceContent } from "@/types";
import type { JSONContent } from "novel";
import { create } from "zustand";

type TPrivileges = {
	_id: string;
	role: string[];
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
	title: string | undefined;
	icon: string | undefined;
	cover: string | undefined;
	coverPos: number;
	workspace: "main" | "everything";
	members: TAuthUser[] | null;
	parentPageId: string | null;
	childPageId: string | null;
	privileges: TPrivileges | null;
	subPages: IUserWorkspace[];
	content: JSONContent | undefined;
}

interface IUserWorkspaceStore {
	workspace: {
		main: IUserWorkspace[];
		everything: IUserWorkspace[];
		recent: TNavigationWorkspaceContent[] | undefined;
	};
	addNewRecentWorkspace: (
		workspaceId: string,
		workspaceType: string,
		workspaceTitle: string,
		workspaceIcon: string,
		workspaceCover: string,
	) => void;
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
		workspaceType: "main" | "everything",
	) => void;
	removeWorkspace: (
		workspaceId: string,
		workspaceType: "main" | "everything",
	) => void;
	pushWorkspaceToDifferentWorkspace: (
		currentWorkspaceId: string,
		toWorkspaceId: string,
		workspaceType: "main" | "everything",
		toWorkspaceType: "main" | "everything",
	) => void;
}

export const useWorkspaceStore = create<IUserWorkspaceStore>((set) => ({
	workspace: {
		main: [
			{
				_id: "myDashboard1",
				title: "Dhruv dashboard",
				icon: "homeIcon.svg",
				cover: "airport.jpeg",
				coverPos: 50,
				workspace: "main",
				members: null,
				parentPageId: null,
				childPageId: "subPage1",
				privileges: null,
				content: undefined,
				subPages: [
					{
						_id: "subPage1",
						title: "Todo list",
						icon: "pageIcon.svg",
						cover: "singapore3.jpeg",
						workspace: "main",
						coverPos: 50,
						members: null,
						parentPageId: "myDashboard1",
						childPageId: "subSubPage1",
						privileges: null,
						content: undefined,
						subPages: [
							{
								_id: "subSubPage1",
								title: "Startup Ideas",
								icon: "homeIcon.svg",
								cover:
									"birthday house decoration barbie house decoration games birthday house decoration ideas bridal house.jpg",
								workspace: "main",
								coverPos: 50,
								members: null,
								parentPageId: "subPage1",
								childPageId: null,
								privileges: null,
								content: undefined,
								subPages: [
									{
										_id: "subSubSubPage1",
										title: "WBBA-Beyblade",
										icon: "homeIcon.svg",
										cover: undefined,
										coverPos: 50,
										workspace: "main",
										members: null,
										parentPageId: "subSubPage1",
										childPageId: null,
										privileges: null,
										content: undefined,
										subPages: [],
									},
								],
							},
						],
					},
					{
						_id: "subPage2",
						title: "Meetings",
						icon: "usersIcon.svg",
						cover: "GVTIye_awAAS9lW.jpg",
						coverPos: 50,
						workspace: "main",
						members: null,
						parentPageId: "myDashboard1",
						childPageId: null,
						privileges: null,
						content: undefined,
						subPages: [],
					},
				],
			},
			{
				_id: "dashboard2",
				title: "Goals before 2024",
				icon: "clockIcon.svg",
				cover: "singapore2.jpg",
				coverPos: 50,
				workspace: "main",
				members: null,
				parentPageId: null,
				childPageId: "subPage3",
				privileges: null,
				content: undefined,
				subPages: [
					{
						_id: "subPage3",
						title: "Physique",
						icon: "fireIcon.svg",
						cover: undefined,
						workspace: "main",
						members: null,
						parentPageId: "dashboard2",
						coverPos: 50,
						childPageId: "subSubPage2",
						privileges: null,
						content: undefined,
						subPages: [
							{
								_id: "subSubPage2",
								title: "Alpha Details",
								icon: "homeIcon.svg",
								cover: undefined,
								workspace: "main",
								coverPos: 50,
								members: null,
								parentPageId: "subPage3",
								childPageId: null,
								privileges: null,
								content: undefined,
								subPages: [],
							},
						],
					},
					{
						_id: "subPage4",
						title: "Investment",
						icon: "walletIcon.svg",
						cover: undefined,
						workspace: "main",
						coverPos: 50,
						members: null,
						parentPageId: "dashboard2",
						childPageId: null,
						privileges: null,
						content: undefined,
						subPages: [],
					},
				],
			},
			{
				_id: "dashboard3",
				title: "Study Materials",
				icon: "bookIcon.svg",
				cover: "singapore3.jpeg",
				coverPos: 50,
				workspace: "main",
				members: null,
				parentPageId: null,
				childPageId: null,
				privileges: null,
				content: undefined,
				subPages: [],
			},
			{
				_id: "dashboard4",
				title: "Photography",
				icon: "cameraIcon.svg",
				cover: undefined,
				coverPos: 50,
				workspace: "main",
				members: null,
				parentPageId: null,
				childPageId: null,
				privileges: null,
				content: undefined,
				subPages: [],
			},
		],
		everything: [
			{
				_id: "everythingId",
				title: "Everything dashboard",
				icon: "homeIcon.svg",
				cover: "airport.jpeg",
				coverPos: 50,
				workspace: "everything",
				members: null,
				parentPageId: null,
				childPageId: "subPage1",
				privileges: null,
				content: undefined,
				subPages: [],
			},
		],
		recent: undefined,
	},

	updateWorkspaceTitleById: (
		workspaceId: string,
		title: string,
		workspaceType: string,
	) => {
		if (workspaceType === "main") {
			set((state) => ({
				workspace: {
					...state.workspace,
					main: updateWorkspaceTitleById(
						state.workspace.main,
						workspaceId,
						title,
					),
				},
			}));
		} else {
			set((state) => ({
				workspace: {
					...state.workspace,
					everything: updateWorkspaceTitleById(
						state.workspace.everything,
						workspaceId,
						title,
					),
				},
			}));
		}
	},

	pushWorkspaceToDifferentWorkspace: (
		currentWorkspaceId: string,
		toWorkspaceId: string,
		workspaceType: "main" | "everything",
		toWorkspaceType: "main" | "everything",
	) => {
		set((state) => {
			const findWorkspaceAndRemove = (
				workspaces: IUserWorkspace[],
				currentWorkspaceId: string,
			): IUserWorkspace | undefined => {
				for (let i = 0; i < workspaces.length; i++) {
					if (workspaces[i]._id === currentWorkspaceId) {
						return workspaces.splice(i, 1)[0];
					}
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

			const workspaceToMove = findWorkspaceAndRemove(
				[...state.workspace[workspaceType]],
				currentWorkspaceId,
			);

			if (!workspaceToMove) {
				return state;
			}

			workspaceToMove.workspace = toWorkspaceType;

			const newWorkspaceState = {
				...state.workspace,
				[workspaceType]: [...state.workspace[workspaceType]],
				[toWorkspaceType]: [...state.workspace[toWorkspaceType]],
			};

			const newWorkspaceLocation = findToWorkspaceLocation(
				newWorkspaceState[toWorkspaceType],
				toWorkspaceId,
			);

			if (!newWorkspaceLocation) {
				return state;
			}

			newWorkspaceLocation.subPages = [
				workspaceToMove,
				...newWorkspaceLocation.subPages,
			];

			return {
				...state,
				workspace: newWorkspaceState,
			};
		});
	},

	addNewRecentWorkspace: (
		workspaceId: string,
		workspaceType: string,
		workspaceTitle: string,
		workspaceIcon: string,
		workspaceCover: string,
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

	addNewSubWorkspaceById: (
		workspaceId: string,
		workspaceType: "main" | "everything",
	) => {
		if (workspaceType === "main") {
			set((state) => ({
				workspace: {
					...state.workspace,
					main: addNewSubWorkspaceToParent(
						state.workspace.main,
						workspaceId,
						workspaceType,
					),
				},
			}));
		} else {
			set((state) => ({
				workspace: {
					...state.workspace,
					everything: addNewSubWorkspaceToParent(
						state.workspace.everything,
						workspaceId,
						workspaceType,
					),
				},
			}));
		}
	},

	removeWorkspace: (
		workspaceId: string,
		workspaceType: "main" | "everything",
	) => {
		if (workspaceType === "main") {
			set((state) => ({
				workspace: {
					...state.workspace,
					main: removeWorkspaceById(state.workspace.main, workspaceId),
				},
			}));
		} else {
			set((state) => ({
				workspace: {
					...state.workspace,
					everything: removeWorkspaceById(
						state.workspace.everything,
						workspaceId,
					),
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
					main: updateWorkspaceContentById(
						state.workspace.main,
						workspaceId,
						content,
					),
				},
			}));
		} else {
			set((state) => ({
				workspace: {
					...state.workspace,
					everything: updateWorkspaceContentById(
						state.workspace.everything,
						workspaceId,
						content,
					),
				},
			}));
		}
	},

	updateWorkspaceCover: (
		workspaceId: string,
		workspaceType: string,
		workspaceCover: string,
	) => {
		console.log("hello world", workspaceCover);
		if (workspaceType === "main") {
			set((state) => ({
				workspace: {
					...state.workspace,
					main: updateWorkspaceCoverById(
						state.workspace.main,
						workspaceId,
						workspaceCover,
					),
				},
			}));
		} else {
			set((state) => ({
				workspace: {
					...state.workspace,
					everything: updateWorkspaceCoverById(
						state.workspace.everything,
						workspaceId,
						workspaceCover,
					),
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
					main: updateWorkspaceYPositionById(
						state.workspace.main,
						workspaceId,
						yPosition,
					),
				},
			}));
		} else {
			set((state) => ({
				workspace: {
					...state.workspace,
					everything: updateWorkspaceYPositionById(
						state.workspace.everything,
						workspaceId,
						yPosition,
					),
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
	workspaceId: string,
	workspaceType: "main" | "everything",
): IUserWorkspace[] => {
	const newWorkspace: IUserWorkspace = {
		_id: Math.random().toString(36).substring(2, 9),
		title: "Untitled",
		icon: "axon_logo.svg",
		cover: undefined,
		coverPos: 50,
		workspace: workspaceType,
		members: null,
		parentPageId: workspaceId,
		childPageId: null,
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
					workspaceId,
					workspaceType,
				),
			};
		}
		return workspace;
	});
};
