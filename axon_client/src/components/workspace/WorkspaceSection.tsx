"use client";

import { useWorkspaceStore } from "@/stores/workspace";
import Workspace from "./Workspace";

const WorkspaceSection = () => {
	const workspaceStore = useWorkspaceStore();

	return (
		<>
			<p className="text-[10px] text-neutral-600">Main</p>
			{workspaceStore.workspace.main.map((workspaceLink) => {
				return (
					<Workspace workspaceLink={workspaceLink} key={workspaceLink.title} />
				);
			})}
			<p className="text-[10px] text-neutral-600">Everything</p>
			{workspaceStore.workspace.everything.map((workspaceLink) => {
				return (
					<Workspace workspaceLink={workspaceLink} key={workspaceLink.title} />
				);
			})}
		</>
	);
};

export default WorkspaceSection;
