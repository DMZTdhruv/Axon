import type { TAuthUser } from "@/types";
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
	workspace: string;
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
	};
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
	addNewSubWorkspaceById: (workspaceId: string, workspaceType: string) => void;
	removeWorkspace: (workspaceId: string, workspaceType: string) => void;
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

	addNewSubWorkspaceById: (workspaceId: string, workspaceType: string) => {
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

	removeWorkspace: (workspaceId: string, workspaceType: string) => {
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
			// Skip this workspace (effectively removing it)
			return acc;
		}

		if (workspace.subPages) {
			// Recursively remove from subPages
			return [
				// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
				...acc,
				{
					...workspace,
					subPages: removeWorkspaceById(workspace.subPages, workspaceId),
				},
			];
		}

		// Keep this workspace
		// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
		return [...acc, workspace];
	}, []);
};
const addNewSubWorkspaceToParent = (
	workspaces: IUserWorkspace[],
	workspaceId: string,
	workspaceType: string,
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
