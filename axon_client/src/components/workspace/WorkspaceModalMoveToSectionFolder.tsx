"use client";

import { useWorkspaceStore, type IUserWorkspace } from "@/stores/workspace";
import React, { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import WorkspaceModal from "./workspaceModal";

const WorkspaceModalMoveToSectionFolder = ({
	workspaceLink,
	currentWorkspaceId,
	currentWorkspaceType,
}: {
	workspaceLink: IUserWorkspace;
	currentWorkspaceId: string;
	currentWorkspaceType: "main" | "axonverse";
}) => {
	const [openFolder, setOpenFolder] = useState<boolean>(false);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const { pushWorkspaceToDifferentWorkspace } = useWorkspaceStore();

	return (
		<div
			key={workspaceLink._id}
			className="flex relative rounded-xl z-[10] flex-col gap-1"
		>
			<button
				type="button"
				className={
					"flex select-none p-[0.40rem] rounded-lg cursor-pointer items-center justify-between text-[13px] hover:bg-neutral-800/50 transition-all  gap-[10px]"
				}
			>
				<div className="flex flex-1 items-center gap-1 ">
					<div className="relative transition-all rounded-md w-[17px] h-[17px]">
						<button
							onClick={() => setOpenFolder((prev) => !prev)}
							type="button"
							className={`absolute 
								opacity-60 hover:opacity-100 rounded-sm p-1
								${openFolder ? "rotate-90" : "rotate-0"}
								opacity-100 transition-all top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]`}
						>
							<IoIosArrowForward />
						</button>
					</div>
					<button
						className="flex  gap-2 flex-1 flex-shrink-0 "
						type="button"
						onClick={() => {
							console.log("hello");
							pushWorkspaceToDifferentWorkspace(
								currentWorkspaceId,
								workspaceLink._id,
								currentWorkspaceType,
								workspaceLink.workspace,
							);
						}}
					>
						<img
							width={17}
							height={17}
							src={`/assets/${workspaceLink.icon}`}
							alt={`icon_${workspaceLink.title}`}
						/>
						<span>
							{workspaceLink.title
								? workspaceLink.title.length > 18
									? `${workspaceLink.title.substring(0, 10)}...`
									: workspaceLink.title
								: "untitled"}
						</span>
					</button>
				</div>
			</button>
			{openModal && (
				<WorkspaceModal
					workspaceId={workspaceLink._id}
					setModal={setOpenModal}
					workspaceType={workspaceLink.workspace}
				/>
			)}
			{openFolder &&
				(workspaceLink?.subPages && workspaceLink?.subPages?.length !== 0 ? (
					openFolder && (
						<div className="flex  ml-2 border-neutral-800 gap-1 flex-col ">
							{workspaceLink?.subPages?.map((subPage) => {
								if (currentWorkspaceId !== subPage._id) {
									return (
										<WorkspaceMoveToSubFolder
											currentWorkspaceType={currentWorkspaceType}
											currentWorkspaceId={currentWorkspaceId}
											key={subPage._id}
											workspaceLink={subPage}
										/>
									);
								}
							})}
						</div>
					)
				) : (
					<p className="text-[13px] pl-6 opacity-35">No pages here</p>
				))}
		</div>
	);
};

export default WorkspaceModalMoveToSectionFolder;

const WorkspaceMoveToSubFolder = ({
	workspaceLink,
	currentWorkspaceId,
	currentWorkspaceType,
}: {
	workspaceLink: IUserWorkspace;
	currentWorkspaceId: string;
	currentWorkspaceType: "main" | "axonverse";
}) => {
	const [openFolder, setOpenFolder] = useState<boolean>(false);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const { addNewSubWorkspaceById, addNewRecentWorkspace } = useWorkspaceStore();
	const { pushWorkspaceToDifferentWorkspace } = useWorkspaceStore();

	return (
		<div className="flex flex-col ">
			<div
				key={workspaceLink.title}
				className={
					"flex group cursor-pointer p-[0.40rem] rounded-md hover:bg-neutral-800/50  items-center justify-between text-[13px] hover:opacity-100 transition-all  gap-[10px]"
				}
			>
				<div className="flex flex-1 items-center gap-1 ">
					<div className="relative transition-all rounded-md w-[17px] h-[17px]">
						<button
							onClick={() => setOpenFolder((prev) => !prev)}
							type="button"
							className={`absolute 
								opacity-60 hover:opacity-100 rounded-sm p-1
								${openFolder ? "rotate-90" : "rotate-0"}
								opacity-100 transition-all top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]`}
						>
							<IoIosArrowForward />
						</button>
					</div>
					<button
						type="button"
						className="flex flex-1 flex-shrink-0  gap-2"
						onClick={() => {
							console.log("hello");
							pushWorkspaceToDifferentWorkspace(
								currentWorkspaceId,
								workspaceLink._id,
								currentWorkspaceType,
								workspaceLink.workspace,
							);
						}}
					>
						<img
							width={17}
							height={17}
							src={`/assets/${workspaceLink.icon}`}
							alt={`icon_${workspaceLink.title}`}
						/>
						<span>
							{workspaceLink.title
								? workspaceLink.title.length > 18
									? `${workspaceLink.title.substring(0, 10)}...`
									: workspaceLink.title
								: "untitled"}
						</span>
					</button>
				</div>
			</div>
			{openModal && (
				<WorkspaceModal
					workspaceId={workspaceLink._id}
					setModal={setOpenModal}
					workspaceType={workspaceLink.workspace}
				/>
			)}
			{openFolder && (
				<div className="flex gap-1 border-neutral-800/ ml-2 flex-col ">
					{workspaceLink?.subPages && workspaceLink?.subPages?.length !== 0 ? (
						workspaceLink?.subPages?.map((folderName) => {
							if (folderName._id !== currentWorkspaceId) {
								return (
									<WorkspaceMoveToSubFolder
										currentWorkspaceType={currentWorkspaceType}
										key={folderName._id}
										currentWorkspaceId={currentWorkspaceId}
										workspaceLink={folderName}
									/>
								);
							}
							if (
								folderName.subPages.length === 1 &&
								folderName._id === currentWorkspaceId
							) {
								return (
									<p
										className="text-[13px] pl-6 py-1 opacity-35"
										key={folderName._id}
									>
										No pages here
									</p>
								);
							}
						})
					) : (
						<p className="text-[13px] pl-6 py-1 opacity-35">No pages here</p>
					)}
				</div>
			)}
		</div>
	);
};
