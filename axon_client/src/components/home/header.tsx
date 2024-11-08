"use client";

import { useAuthStore } from "@/stores/auth";
import { useUserStore } from "@/stores/user";
import Image from "next/image";
import { IoDocumentTextOutline } from "react-icons/io5";
import { Skeleton } from "../ui/skeleton";
import { BsLayoutSidebar } from "react-icons/bs";
import { FiSidebar } from "react-icons/fi";
import { useWorkspaceStore } from "@/stores/workspace";

const Header = () => {
	const user = useUserStore();
	const { isAuthenticated } = useAuthStore();
	const { openNavHandler } = useWorkspaceStore();
	if (!isAuthenticated) {
		return <Skeleton className="w-full h-[289px] bg-neutral-900" />;
	}

	return (
		<section>
			<div className="h-[309px] group transition-all relative w-full ">
				<button className="absolute hover:bg-neutral-800/20 hover:backdrop-blur-md p-2 rounded-md top-4 group left-4 z-[100]">
					<FiSidebar height={30} width={30} onClick={openNavHandler} className="active:scale-90"/>
				</button>

				<div className=" fade-in-0 animate-in relative w-full h-full">
					<div className="bg-gradient-to-b from-slate-50/0 via-[#0F0F0F]/60 to-[#0F0F0F] to-[93%] h-full w-full select-none absolute z-[5] top-0 left-0" />

					{!user.userCover ? (
						<div className="h-full relative opacity-0 group-hover:opacity-100 transition-all  w-full">
							<div className="flex gap-2 absolute top-[24px] right-[24px]">
								<button
									type="button"
									className="bg-[#262626]/70 hover:bg-[#262626] backdrop-blur-lg  transition-all text-[13px] rounded-xl px-[10px] py-[8px]"
								>
									Upload an image
								</button>
							</div>
						</div>
					) : (
						<Image
							src={`/assets/${user.userCover}`}
							alt="idk man"
							height={250}
							width={250}
							className="w-full transition-all h-full object-cover"
							priority={true}
							unoptimized
						/>
					)}

					<div className="absolute flex gap-2 items-end bottom-[10px] left-[40px] z-[10]">
						{user.userIcon ? (
							<Image
								alt="workspace_icon"
								src={`/assets/${user.userIcon}`}
								height={25}
								width={25}
								draggable={false}
								className="mb-[8px]  select-none "
							/>
						) : (
							<IoDocumentTextOutline
								size={25}
								className="mb-[8px]  select-none "
							/>
						)}
						<div className="flex flex-col ">
							<span className="text-[13px]  leading-tight">Welcome to </span>
							<h1 className="text-[30px] leading-tight font-semibold">Home</h1>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Header;
