"use client";

import { useWorkspaceStore } from "@/stores/workspace";
import Workspace from "./Workspace";
import { IoIosAdd } from "react-icons/io";
import { useAuthStore } from "@/stores/auth";
import useCreateNewParentWorkspace from "@/hooks/workspace/useCreateParentWorkspace";

const WorkspaceSection = () => {
	const workspaceStore = useWorkspaceStore();
	const { user } = useAuthStore();
	const { createParentWorkspace } = useCreateNewParentWorkspace();

	const handleAddWorkspace = (workspaceType: "main" | "axonverse") => {
		if (!user?._id) return;
		const { newWorkspaceId, newWorkspaceType } =
			workspaceStore.addNewParentWorkspace(workspaceType, user._id);
		createParentWorkspace({
			_id: newWorkspaceId,
			createdBy: user._id,
			workspace: newWorkspaceType,
			removeWorkspace: workspaceStore.removeWorkspace,
		});
	};

	return (
		<>
			<div className="text-[10px] flex items-center justify-between gap-1 group ">
				<span className="text-neutral-600">Main</span>
				<button
					type="button"
					onClick={() => handleAddWorkspace("main")}
					className="opacity-0 group-hover:opacity-100 scale-[1.5]"
				>
					<IoIosAdd className="opacity-60 hover:opacity-100 active:scale-[0.9]" />
				</button>
			</div>
			{workspaceStore.workspace?.main?.map((workspaceLink) => {
				return (
					<Workspace workspaceLink={workspaceLink} key={workspaceLink._id} />
				);
			})}
			{(!workspaceStore.workspace.main ||
				workspaceStore.workspace.main.length === 0) && (
				<button
					type="button"
					onClick={() => handleAddWorkspace("main")}
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
						handleAddWorkspace("axonverse");
					}}
					className="opacity-0 group-hover:opacity-100 scale-[1.5]"
				>
					<IoIosAdd className="opacity-60 hover:opacity-100 active:scale-[0.9]" />
				</button>
			</div>
			{workspaceStore.workspace?.axonverse?.map((workspaceLink) => {
				return (
					<Workspace workspaceLink={workspaceLink} key={workspaceLink._id} />
				);
			})}
			{(!workspaceStore.workspace.axonverse ||
				workspaceStore.workspace.axonverse.length === 0) && (
				<button
					type="button"
					onClick={() => {
						handleAddWorkspace("axonverse");
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
