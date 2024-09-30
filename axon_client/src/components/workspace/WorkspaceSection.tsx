"use client";

import { useWorkspaceStore } from "@/stores/workspace";
import Workspace from "./Workspace";
import { IoIosAdd } from "react-icons/io";
import { useEffect } from "react";

const WorkspaceSection = () => {
	const workspaceStore = useWorkspaceStore();

	useEffect(() => {
		console.log("Current workspace state:", workspaceStore.workspace);
	}, [workspaceStore.workspace]);

	return (
		<>
			<div className="text-[10px] flex items-center justify-between gap-1 group ">
				<span className="text-neutral-600">Main</span>
				<button
					type="button"
					onClick={() => {
						workspaceStore.addNewParentWorkspace("main");
					}}
					className="opacity-0 group-hover:opacity-100 scale-[1.5]"
				>
					<IoIosAdd className="opacity-60 hover:opacity-100 active:scale-[0.9]" />
				</button>
			</div>
			{workspaceStore.workspace?.main?.map((workspaceLink) => {
				return (
					<Workspace workspaceLink={workspaceLink} key={workspaceLink.title} />
				);
			})}
			{(!workspaceStore.workspace.main ||
				workspaceStore.workspace.main.length === 0) && (
				<button
					type="button"
					onClick={() => {
						workspaceStore.addNewParentWorkspace("main");
					}}
					className="opacity-100 text-[13px] justify-between p-1 bg-neutral-900 hover:bg-neutral-800 transition-all rounded-md px-2 flex gap-1 items-center"
				>
					Create main workspace
					<IoIosAdd className="opacity-60 hover:opacity-100 active:scale-[0.9]" />
				</button>
			)}
			<div className="text-[10px] flex items-center justify-between gap-1 group ">
				<span className="text-neutral-600">Axonverse</span>
				<button
					type="button"
					onClick={() => {
						workspaceStore.addNewParentWorkspace("axonverse");
					}}
					className="opacity-0 group-hover:opacity-100 scale-[1.5]"
				>
					<IoIosAdd className="opacity-60 hover:opacity-100 active:scale-[0.9]" />
				</button>
			</div>
			{workspaceStore.workspace?.axonverse?.map((workspaceLink) => {
				return (
					<Workspace workspaceLink={workspaceLink} key={workspaceLink.title} />
				);
			})}
			{(!workspaceStore.workspace.axonverse ||
				workspaceStore.workspace.axonverse.length === 0) && (
				<button
					type="button"
					onClick={() => {
						workspaceStore.addNewParentWorkspace("axonverse");
					}}
					className="opacity-100 text-nowrap text-[13px] justify-between p-1 bg-neutral-900 hover:bg-neutral-800 transition-all rounded-md px-2 flex gap-1 items-center"
				>
					Create workspace
					<IoIosAdd className="opacity-60 hover:opacity-100 active:scale-[0.9]" />
				</button>
			)}
		</>
	);
};

export default WorkspaceSection;
