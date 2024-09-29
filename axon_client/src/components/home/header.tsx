"use client";

import { useAuthStore } from "@/stores/auth";
import Image from "next/image";
import { IoDocumentTextOutline } from "react-icons/io5";

const Header = () => {
	const authUser = useAuthStore();
	if (!authUser._id) {
		return <p>Unauthenticated user</p>;
	}

	return (
		<section>
			<div className="h-[289px] group transition-all relative w-full ">
				<div className=" fade-in-0 animate-in relative w-full h-full">
					<div className="bg-gradient-to-b h-full w-full select-none  from-slate-50/0 absolute z-0 top-0 left-0 to-neutral-950/90 " />

					{!authUser.mainCover ? (
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
							src={`/assets/${authUser.mainCover}`}
							alt="idk man"
							height={250}
							width={250}
							className="w-full transition-all h-full object-cover"
							priority={true}
							unoptimized
						/>
					)}

					<div className="absolute flex gap-2 items-end bottom-[30px] left-[40px] z-[10]">
						{authUser.mainIcon ? (
							<Image
								alt="workspace_icon"
								src={`/assets/${authUser.mainIcon}`}
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
						<div className="flex flex-col">
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
