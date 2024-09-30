"use client";

import { useWorkspaceStore } from "@/stores/workspace";
import Workspace from "./Workspace";
import { IoIosAdd } from "react-icons/io";

const WorkspaceSection = () => {
	const workspaceStore = useWorkspaceStore();

	return (
		<>
			<div className="text-[10px] flex items-center justify-between gap-1 group ">
				<span className="text-neutral-600">Main</span>
				<button
					type="button"
					onClick={() => {
						workspaceStore.addNewParentWorkspace("main");
					}}
					className="opacity-0 group-hover:opacity-100 scale-[2]"
				>
					<IoIosAdd className="opacity-60 hover:opacity-100 active:scale-[0.9]" />
				</button>
			</div>
			{workspaceStore.workspace?.main?.map((workspaceLink) => {
				return (
					<Workspace workspaceLink={workspaceLink} key={workspaceLink.title} />
				);
			})}
			<div className="text-[10px] flex items-center justify-between gap-1 group ">
				<span className="text-neutral-600">Axonverse</span>
				<button
					type="button"
					onClick={() => {
						workspaceStore.addNewParentWorkspace("axonverse");
					}}
					className="opacity-0 group-hover:opacity-100 scale-[2]"
				>
					<IoIosAdd className="opacity-60 hover:opacity-100 active:scale-[0.9]" />
				</button>
			</div>
			{workspaceStore.workspace?.axonverse?.map((workspaceLink) => {
				return (
					<Workspace workspaceLink={workspaceLink} key={workspaceLink.title} />
				);
			})}
		</>
	);
};

export default WorkspaceSection;
