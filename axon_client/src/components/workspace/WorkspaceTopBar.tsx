"use client";

import type { IUserWorkspace } from "@/stores/workspace";
import type { IRoutes } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BsPlus, BsThreeDots } from "react-icons/bs";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import WorkspaceModal from "./workspaceModal";

const WorkspaceTopBar = ({
	currentWorkspace,
	folders,
}: { currentWorkspace: IUserWorkspace; folders: IRoutes[] }) => {
	const router = useRouter();
	const [openModal, setOpenModal] = useState<boolean>(false);
	return (
		<div className="flex transition-all z-[1000] top-0 border-b-2 border-[#262626]  sticky gap-[16px] h-[42px] items-center bg-customMain/50">
			<div className="flex ml-2 gap-2">
				<button type="button" className="group">
					<IoIosArrowBack
						className=" group-active:scale-90"
						onClick={() => {
							router.back();
						}}
					/>
				</button>
				<button type="button" className="group">
					<IoIosArrowForward
						className=" group-active:scale-90"
						onClick={() => {
							router.forward();
						}}
					/>
				</button>
			</div>

			<div className="flex gap-10 relative items-center">
				<div className="flex gap-2 items-center">
					<Image
						alt="workspace_icon"
						src={`/assets/${currentWorkspace.icon}`}
						height={17}
						width={17}
						draggable={false}
						className=" mb-[1px]  select-none "
					/>
					<div className="text-[13px] items-center gap-[5px] flex">
						{folders.map((folder, index) => {
							return (
								<Link
									href={`/workspace/${folder.workspace}/${folder._id}`}
									key={folder._id}
								>
									{folder._id === currentWorkspace?._id ? (
										<span className="hover:underline  shadow_topBar--text ">
											{folder.title}
										</span>
									) : (
										<span className="text-neutral-300  hover:underline">
											{folder.title}
										</span>
									)}
									{index !== folders.length - 1 && " /"}
								</Link>
							);
						})}
						<div className="bg-white rounded-[2.5px]  shadow_topBar--box flex items-center justify-center h-[15px] w-[15px] text-black text-[11px] leading-tight">
							<span className="font-bold">
								{currentWorkspace.workspace === "main" ? "M" : "E "}
							</span>
						</div>
					</div>
				</div>
				<BsThreeDots
					className="hover:bg-white hover:text-black cursor-pointer transition-all rounded-[2.5px] hover:shadow_topBar--box"
					onClick={() => {
						setOpenModal((prev) => !prev);
					}}
				/>
				{openModal && (
					<WorkspaceModal
						workspaceId={currentWorkspace._id}
						workspaceType={currentWorkspace.workspace}
						setModal={setOpenModal}
					/>
				)}
			</div>
			<div className="border-l-2 pl-2  relative  border-neutral-800">
				<BsPlus className="hover:bg-white hover:text-black cursor-pointer transition-all rounded-[2.5px] hover:shadow_topBar--box" />
			</div>
		</div>
	);
};

export default WorkspaceTopBar;
