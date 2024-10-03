"use client";

import useWorkspaceUtils from "@/hooks/useWorkspaceUtils";
import { useWorkspaceStore } from "@/stores/workspace";
import type React from "react";
import { type SetStateAction, useState } from "react";
import { FiTrash2, FiEdit, FiShare2, FiCopy } from "react-icons/fi";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { MdOutlineCancel } from "react-icons/md";
import { IoAdd } from "react-icons/io5";
import { LuArrowLeftRight } from "react-icons/lu";
import WorkspaceModalMoveToSectionFolder from "./WorkspaceModalMoveToSectionFolder";

interface WorkspaceModalProps {
	workspaceId: string;
	workspaceType: "main" | "axonverse";
	userId: string;
	setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface INameState {
	openSetNameModal: boolean;
	nameOfBanner: string;
}

const WorkspaceModal = ({
	workspaceId,
	workspaceType,
	setModal,
	userId,
}: WorkspaceModalProps) => {
	const workspace = useWorkspaceUtils();
	const currentWorkspace = workspace.findWorkspace(workspaceId, workspaceType);
	const { updateWorkspaceTitleById, addNewSubWorkspaceById, removeWorkspace } =
		useWorkspaceStore();

	const [moveToHover, setMoveToHover] = useState<boolean>(false);
	const [newName, setNewName] = useState<INameState>({
		openSetNameModal: false,
		nameOfBanner: currentWorkspace?.title as string,
	});

	if (!currentWorkspace) return null;

	return (
		<div className="absolute shadow-lg shadow-2xl  rounded-xl fade-in-0 border-neutral-800 border  top-0 left-[105%] z-[10] w-[250px] h-auto bg-neutral-950/50">
			<div className="parent_backdrop--blur  p-[0.40rem] ">
				<div className="relative  h-full w-full">
					{newName.openSetNameModal && (
						<div className="absolute  z-[5] duration-300 rename flex-col top-0 w-[200px] left-[110%]">
							<div className=" parent_backdrop--blur  bg-neutral-950/50 border-neutral-800 border rounded-xl flex p-[0.40rem]  flex-col gap-2">
								<Input
									placeholder="Enter a new name"
									className="ring-0  animate-in fade-in-0 border-0  bg-neutral-900 backdrop-blur-md  focus-visible:ring-offset-0 focus-visible:ring-0"
									value={newName.nameOfBanner}
									onChange={(e) => {
										setNewName((prev) => {
											return {
												...prev,
												nameOfBanner: e.target.value,
											};
										});
									}}
								/>
								<div className="flex animate-in fade-in-0 gap-[0.40rem]">
									<Button
										size="sm"
										className="bg-neutral-900 text-sm hover:bg-green-900/50 text-white"
										onClick={() => {
											updateWorkspaceTitleById(
												currentWorkspace._id,
												newName.nameOfBanner,
												workspaceType,
											);
											setModal(() => false);
										}}
									>
										Change
									</Button>
									<Button
										size={"sm"}
										onClick={() => {
											setNewName((prev) => {
												return {
													...prev,
													openSetNameModal: false,
												};
											});
										}}
										className="bg-neutral-900 text-sm animate-in fade-in-0  hover:bg-neutral-800 text-white"
									>
										Cancel
									</Button>
								</div>
							</div>
						</div>
					)}
				</div>
				<div>
					<div className="flex flex-col animate-in fade-in-0 gap-[0.40rem]">
						<button
							type="button"
							onClick={() =>
								setNewName((prev) => ({ ...prev, openSetNameModal: true }))
							}
							className="flex group w-full relative items-center gap-3 py-1 px-2 hover:bg-neutral-800/50 rounded-md cursor-pointer transition-colors"
						>
							<FiEdit
								className="text-neutral-400 group-active:scale-90 "
								size={18}
							/>
							<span className="text-sm text-neutral-300">Rename</span>
						</button>
						<button
							type="button"
							className="flex group items-center w-full gap-3 py-1 px-2 hover:bg-neutral-800/50 rounded-md cursor-pointer transition-colors"
							onClick={() => {
								addNewSubWorkspaceById(
									currentWorkspace._id,
									userId,
									workspaceType,
								);
							}}
						>
							<IoAdd
								className="text-neutral-400 group-active:scale-90 "
								size={18}
							/>
							<span className="text-sm text-neutral-300">
								Add a new sub workspace
							</span>
						</button>
						{/* biome-ignore lint/a11y/useKeyWithMouseEvents: <explanation> */}
						<div
							className="flex relative z-[10] group items-center gap-3 py-1 px-2 hover:bg-neutral-800/50 rounded-md cursor-pointer transition-colors"
							onMouseOver={() => setMoveToHover(() => true)}
							onMouseLeave={() => setMoveToHover(() => false)}
						>
							<LuArrowLeftRight
								className="text-neutral-400 group-active:scale-90 "
								size={18}
							/>
							<span className="text-sm text-neutral-300">Move to</span>
							{moveToHover && (
								<WorkspaceMoveToModal
									userId={userId}
									workspaceType={workspaceType}
									workspaceId={workspaceId}
									setMoveToHover={setMoveToHover}
								/>
							)}
						</div>
						<div className="flex group items-center gap-3 py-1 px-2 hover:bg-neutral-800/50 rounded-md cursor-pointer transition-colors">
							<FiCopy
								className="text-neutral-400 group-active:scale-90 "
								size={18}
							/>
							<span className="text-sm text-neutral-300">Duplicate</span>
						</div>
						<button
							className="flex w-full group items-center gap-3 py-1 px-2 hover:bg-neutral-800/50 rounded-md cursor-pointer transition-colors"
							type="button"
							onClick={() => {
								const url = window.location.href;
								navigator.clipboard.writeText(url).then(() => {
									toast("Link copied to clipboard", {
										description: url,
										action: {
											label: "Open",
											onClick: () => window.open(url, "_blank"),
										},
									});
								});
							}}
						>
							<FiShare2
								className="text-neutral-400 group-active:scale-90 "
								size={18}
							/>
							<span className="text-sm text-neutral-300">Share</span>
						</button>
						<button
							type="button"
							className="flex w-full group items-center gap-3 py-1 px-2 hover:bg-red-800/50 rounded-md cursor-pointer transition-colors"
							onClick={() => removeWorkspace(workspaceId, workspaceType)}
						>
							<FiTrash2
								className="text-neutral-400 group-active:scale-90 "
								size={18}
							/>
							<span className="text-sm text-neutral-300">Trash</span>
						</button>
						<button
							className="flex group w-full items-center gap-3 py-1 px-2 hover:bg-neutral-800/50 rounded-md cursor-pointer transition-colors"
							type="button"
							onClick={() => setModal(() => false)}
						>
							<MdOutlineCancel
								className="text-neutral-400 group-active:scale-90 "
								size={18}
							/>
							<span className="text-sm text-neutral-300">Close</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default WorkspaceModal;

type TWorkspaceMoveToModalProps = {
	setMoveToHover: React.Dispatch<SetStateAction<boolean>>;
	workspaceId: string;
	userId: string;
	workspaceType: "main" | "axonverse";
};

const WorkspaceMoveToModal = ({
	setMoveToHover,
	workspaceId,
	userId,
	workspaceType,
}: TWorkspaceMoveToModalProps) => {
	const workspaceStore = useWorkspaceStore();

	return (
		<div
			className="absolute group rounded-xl right-[-80%] top-0"
			onMouseLeave={() => setMoveToHover(() => false)}
		>
			<div className="relative p-[0.40rem] flex flex-col gap-[0.40rem] rounded-xl w-[250px]  border-neutral-800 border bg-neutral-950/50 parent_backdrop--blur">
				<p className="text-[13px] text-neutral-600 pl-3">main</p>
				{workspaceStore.workspace?.main?.map((workspaceLink) => {
					if (workspaceLink._id !== workspaceId) {
						return (
							<WorkspaceModalMoveToSectionFolder
								currentWorkspaceId={workspaceId}
								workspaceLink={workspaceLink}
								key={workspaceLink.title}
								userId={userId}
								currentWorkspaceType={workspaceType}
							/>
						);
					}
				})}
				<p className="text-[13px] text-neutral-600 pl-3">axonverse</p>
				{workspaceStore.workspace?.axonverse?.map((workspaceLink) => {
					if (workspaceLink._id !== workspaceId) {
						return (
							<WorkspaceModalMoveToSectionFolder
								currentWorkspaceId={workspaceId}
								userId={userId}
								workspaceLink={workspaceLink}
								key={workspaceLink.title}
								currentWorkspaceType={workspaceType}
							/>
						);
					}
				})}
			</div>
		</div>
	);
};
