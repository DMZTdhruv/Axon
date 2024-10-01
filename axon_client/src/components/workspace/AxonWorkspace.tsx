"use client";

import useWorkspaceUtils from "@/hooks/useWorkspaceUtils";
import { useEffect, useRef, useState } from "react";
import type { IRoutes } from "@/types";
import WorkspaceTopBar from "./WorkspaceTopBar";
import WorkspaceCover from "./WorkspaceCover";
import dynamic from "next/dynamic";
import { useWorkspaceStore } from "@/stores/workspace";
import Link from "next/link";
import Image from "next/image";
// import Editor from "../Editor/axon_editor";

const DynamicAxonEditor = dynamic(
	() => import("@/components/AxonEditor/axonEditor"),
	{
		ssr: false,
		loading: () => (
			<p className=" py-[20px] px-[50px] animate-pulse">Loading editor</p>
		),
	},
);

const AxonWorkspace = ({
	workspaceId,
	workspaceType,
}: { workspaceId: string; workspaceType: string }) => {
	const { findWorkspace, findRoutes } = useWorkspaceUtils();
	const workspaceStore = useWorkspaceStore();
	const currentWorkspace = findWorkspace(workspaceId, workspaceType);

	const [folders, setFolders] = useState<IRoutes[]>([]);
	const folderRef = useRef<IRoutes[]>([]);

	const traversePreviousNodes = (node: IRoutes, nodes: IRoutes[]) => {
		const someList: IRoutes[] = [node, ...nodes];
		folderRef.current = someList;
		if (node.parentPageId === null) return;

		const parentNode = findRoutes(node.parentPageId, workspaceType);

		if (parentNode) {
			traversePreviousNodes(parentNode, someList);
		}
	};

	if (currentWorkspace) {
		const demoObject: IRoutes = {
			_id: currentWorkspace._id,
			workspace: currentWorkspace.workspace,
			title: currentWorkspace.title || "untitled",
			parentPageId: currentWorkspace?.parentPageId,
			childPageId: currentWorkspace?.childPageId,
		};
		traversePreviousNodes(demoObject, []);
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setFolders(() => folderRef.current);
	}, [workspaceStore.workspace]);

	if (!currentWorkspace) {
		return (
			<div className="h-screen gap-3 w-full flex-col flex items-center justify-center">
				<div className="space-y-5 translate-y-[-50px]">
					<Image
						src="/assets/axon_logo.svg"
						height={32}
						width={32}
						alt="axon logo"
						className="mx-auto"
					/>
					<div className="text-center">
						<p className="text-xl font-bold">
							This workspace doesn&apos;t exists
						</p>
						<div>
							Go back to&nbsp;
							<Link
								href={"/"}
								className="text-neutral-400 hover:underline hover:text-neutral-50"
							>
								home
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<>
			<WorkspaceTopBar currentWorkspace={currentWorkspace} folders={folders} />
			<WorkspaceCover currentWorkspace={currentWorkspace} />
			<DynamicAxonEditor
				currentWorkspace={currentWorkspace}
				workspaceId={currentWorkspace._id}
			/>
		</>
	);
};

export default AxonWorkspace;
