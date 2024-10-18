"use client";

import { useWorkspaceStore, type IUserWorkspace } from "@/stores/workspace";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";
import WorkspaceModal from "./workspaceModal";
import { IoIosAdd } from "react-icons/io";
import { useAuthStore } from "@/stores/auth";
import useCreateNewSubParentWorkspace from "@/hooks/workspace/useCreateParentSubWorkspace";
import dynamic from "next/dynamic";
const DynamicIcon = dynamic(() => import("../ui/DynamicIcon"), {
	ssr: false,
});

const Workspace = ({ workspaceLink }: { workspaceLink: IUserWorkspace }) => {
	const [openFolder, setOpenFolder] = useState<boolean>(false);
	const path = usePathname();
	const isActive = path.includes(workspaceLink._id);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const { addNewSubWorkspaceById, addNewRecentWorkspace, removeWorkspace } =
		useWorkspaceStore();
	const { createSubParentWorkspace } = useCreateNewSubParentWorkspace();
	const router = useRouter();
	const { user } = useAuthStore();

	const addNewSubWorkspace = () => {
		if (!user?._id) return;
		const { newWorkspaceId, newWorkspaceType, newWorkspaceParentPageId } =
			addNewSubWorkspaceById(
				workspaceLink._id,
				user._id,
				workspaceLink.workspace,
			);

		if (newWorkspaceParentPageId) {
			createSubParentWorkspace({
				_id: newWorkspaceId,
				parentPageId: newWorkspaceParentPageId,
				workspace: newWorkspaceType,
				createdBy: user._id,
				removeWorkspace,
			});
		}

		router.push(`/workspace/${newWorkspaceType}/${newWorkspaceId}`);
	};

	return (
		<div
			key={workspaceLink._id}
			className="flex animate-in rounded-[8px] fade-in-0 justify-center relative z-[10] flex-col gap-[15px]"
		>
			<div
				className={` flex select-none group cursor-pointer items-center justify-between text-[13px] ${isActive ? "opacity-100" : "opacity-60"} hover:opacity-100 transition-all  gap-[10px]`}
			>
				<div className="flex items-center gap-[10px]">
					<div className="relative hover:bg-neutral-900  transition-all rounded-md w-[17px] h-[17px]">
						{/* <img
							width={17}
							height={17}
							className="absolute opacity-100 group-hover:opacity-0 transition-all top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
							src={`/assets/${workspaceLink.icon}`}
							alt={`icon_${workspaceLink.title}`}
						/> */}
						<DynamicIcon
							name={workspaceLink.icon}
							height={17}
							width={17}
							DClassName="absolute opacity-100 group-hover:opacity-0 transition-all top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
						/>
						{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
						<div
							className={`absolute 
								${openFolder ? "rotate-90" : "rotate-0"}
								opacity-0 group-hover:opacity-100 transition-all top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]`}
							onClick={() => setOpenFolder((prev) => !prev)}
						>
							<IoIosArrowForward />
						</div>
					</div>
					<Link
						href={`/workspace/${workspaceLink.workspace}/${workspaceLink._id}`}
						className="hover:underline leading-[0%]"
						onClick={() => {
							addNewRecentWorkspace(
								workspaceLink._id,
								workspaceLink.workspace,
								workspaceLink.title ? workspaceLink.title : "undefined",
								workspaceLink.icon ? workspaceLink.icon : "axon_logo.svg",
								workspaceLink.cover ? workspaceLink.cover : "",
							);
						}}
					>
						{workspaceLink.title
							? workspaceLink.title.length > 18
								? `${workspaceLink.title.substring(0, 10)}...`
								: workspaceLink.title
							: "untitled"}
					</Link>
				</div>
				<div className="flex gap-1">
					<button
						type="button"
						className="opacity-0 relative active:scale-90 group-hover:opacity-100  hover:bg-neutral-900 p-[3px]  rounded-md"
						onClick={addNewSubWorkspace}
					>
						<IoIosAdd />
					</button>
					<div className="opacity-0 relative active:scale-90 group-hover:opacity-100 p-[3px] hover:bg-neutral-900  rounded-md">
						<BsThreeDots onClick={() => setOpenModal((prev) => !prev)} />
					</div>
				</div>
			</div>
			{openModal && user?._id && (
				<WorkspaceModal
					workspaceId={workspaceLink._id}
					setModal={setOpenModal}
					userId={user?._id}
					workspaceType={workspaceLink.workspace}
				/>
			)}
			{openFolder &&
				(workspaceLink?.subPages && workspaceLink?.subPages?.length !== 0 ? (
					openFolder && (
						<div className="flex ml-2 border-l-2 pl-2 border-neutral-800 flex-col gap-[15px]">
							{workspaceLink?.subPages?.map((subPage) => {
								return (
									<WorkspaceFolder key={subPage._id} workspaceLink={subPage} />
								);
							})}
						</div>
					)
				) : (
					<p className="text-[13px] pl-3 opacity-35">No pages here</p>
				))}
		</div>
	);
};

export default Workspace;

const WorkspaceFolder = ({
	workspaceLink,
}: { workspaceLink: IUserWorkspace }) => {
	const [openFolder, setOpenFolder] = useState<boolean>(false);
	const { createSubParentWorkspace } = useCreateNewSubParentWorkspace();
	const path = usePathname();
	const isActive = path.includes(workspaceLink._id);
	console.log(workspaceLink._id);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const { addNewSubWorkspaceById, addNewRecentWorkspace, removeWorkspace } =
		useWorkspaceStore();
	const router = useRouter();
	const { user } = useAuthStore();

	const addNewSubWorkspace = () => {
		if (!user?._id) return;
		const { newWorkspaceId, newWorkspaceType, newWorkspaceParentPageId } =
			addNewSubWorkspaceById(
				workspaceLink._id,
				user._id,
				workspaceLink.workspace,
			);

		if (newWorkspaceParentPageId) {
			createSubParentWorkspace({
				_id: newWorkspaceId,
				parentPageId: newWorkspaceParentPageId,
				workspace: newWorkspaceType,
				createdBy: user._id,
				removeWorkspace,
			});
		}

		router.push(`/workspace/${newWorkspaceType}/${newWorkspaceId}`);
	};

	return (
		<div className="flex flex-col  fade-in-0 animate-in gap-[15px]">
			<div
				key={workspaceLink.title}
				className={`flex group cursor-pointer items-center justify-between text-[13px] ${isActive ? "opacity-100" : "opacity-60"} hover:opacity-100 transition-all  gap-[10px]`}
			>
				<div className="flex flex-shrink-0 items-center gap-[10px]">
					<div className="relative w-[17px] h-[17px]">
						<DynamicIcon
							name={workspaceLink.icon}
							height={17}
							width={17}
							DClassName="absolute opacity-100 group-hover:opacity-0 transition-all top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
						/>
						{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
						<div
							className={`absolute 
								${openFolder ? "rotate-90" : "rotate-0"}
								opacity-0 group-hover:opacity-100 transition-all top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]`}
							onClick={() => setOpenFolder((prev) => !prev)}
						>
							<IoIosArrowForward />
						</div>
					</div>
					<Link
						onClick={() => {
							addNewRecentWorkspace(
								workspaceLink._id,
								workspaceLink.workspace,
								workspaceLink.title ? workspaceLink.title : "undefined",
								workspaceLink.icon ? workspaceLink.icon : "axon_logo.svg",
								workspaceLink.cover ? workspaceLink.cover : "",
							);
						}}
						href={`/workspace/${workspaceLink.workspace}/${workspaceLink._id}`}
						className="text-nowrap hover:underline "
					>
						{workspaceLink.title}
					</Link>
				</div>

				<div className="flex gap-1">
					<button
						type="button"
						className="opacity-0 relative active:scale-90 group-hover:opacity-100  hover:bg-neutral-900 p-[3px]  rounded-md"
						onClick={addNewSubWorkspace}
					>
						<IoIosAdd />
					</button>
					<div className="opacity-0 relative active:scale-90 group-hover:opacity-100 p-[3px] hover:bg-neutral-900  rounded-md">
						<BsThreeDots onClick={() => setOpenModal((prev) => !prev)} />
					</div>
				</div>
			</div>
			{openModal && user?._id && (
				<WorkspaceModal
					workspaceId={workspaceLink._id}
					setModal={setOpenModal}
					userId={user._id}
					workspaceType={workspaceLink.workspace}
				/>
			)}
			{openFolder && (
				<div className="flex border-l-2 ml-2 border-neutral-800 pl-2 gap-[15px] flex-col ">
					{workspaceLink?.subPages && workspaceLink?.subPages?.length !== 0 ? (
						workspaceLink?.subPages?.map((folderName) => {
							return (
								<WorkspaceFolder
									key={folderName._id}
									workspaceLink={folderName}
								/>
							);
						})
					) : (
						<p className="text-[13px] opacity-35">No pages here</p>
					)}
				</div>
			)}
		</div>
	);
};
