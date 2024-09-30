import { HiOutlineDocument } from "react-icons/hi";
import { useWorkspaceStore, type IUserWorkspace } from "@/stores/workspace";
import Image from "next/image";
import { useState, type ChangeEvent } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const WorkspaceCover = ({
	currentWorkspace,
}: { currentWorkspace: IUserWorkspace }) => {
	const currentWorkspaceTitle = currentWorkspace.title
		? currentWorkspace.title
		: "Untitled";
	const [yPos, setYPos] = useState<number>(currentWorkspace.coverPos);

	const workspace = useWorkspaceStore();

	const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const imageUrl = URL.createObjectURL(file);
			workspace.updateWorkspaceCover(
				currentWorkspace._id,
				currentWorkspace.workspace,
				imageUrl,
			);
		}
	};

	const handleTheYPos = (yPos: number) => {
		setYPos(() => yPos);
		workspace.updateWorkspaceCoverYPosition(
			currentWorkspace._id,
			currentWorkspace.workspace,
			yPos,
		);
	};

	return (
		<div
			className={`${currentWorkspace.cover ? "h-[290px]" : "h-[200px]"} group transition-all relative w-full `}
		>
			<div className=" fade-in-0 animate-in relative w-full h-full">
				{currentWorkspace.cover && (
					<div className="bg-gradient-to-b from-slate-50/0 via-[#0F0F0F]/60 to-[#0F0F0F] to-[83%] h-full w-full select-none absolute z-[5] top-0 left-0" />
				)}

				<div className="absolute top-0 z-[10] w-full left-0">
					<div className="h-full relative opacity-0 group-hover:opacity-100 transition-all  w-full">
						<div className="flex gap-2 absolute top-[24px] right-[24px]">
							<label className="bg-[#262626]/50 hover:bg-[#262626] backdrop-blur-lg  transition-all text-[13px] rounded-xl px-[10px] py-[8px]">
								<input
									type="file"
									accept="image/*"
									onChange={handleImageChange}
									className=" hidden w-0 h-0"
								/>
								{currentWorkspace.cover ? "Change cover" : "Upload an image"}
							</label>
						</div>
					</div>
				</div>

				{/* remove the asset when uploading images to cloud */}
				{currentWorkspace.cover && (
					<Image
						src={`${currentWorkspace?.cover}`}
						alt={`${currentWorkspace.title}`}
						height={250}
						width={250}
						className={
							"w-full transition-all relative z-[1] h-full object-cover"
						}
						style={{ objectPosition: `0px ${yPos}%` }}
						priority={true}
						unoptimized
					/>
				)}
				{/* Limit yPos to stay within 0-100% range */}
				<div className="absolute opacity-0 group-hover:opacity-100 top-[74px] flex flex-col gap-2 right-[24px] z-[10]">
					<button
						onClick={() =>
							handleTheYPos(
								Math.max(0, Math.min(currentWorkspace.coverPos - 10, 100)),
							)
						}
						type="button"
						className="p-2 rounded-lg bg-[#262626]/50 hover:bg-[#262626] backdrop-blur-lg transition-all"
					>
						<IoIosArrowUp size={13} />
					</button>
					<button
						onClick={() =>
							handleTheYPos(
								Math.max(0, Math.min(currentWorkspace.coverPos + 10, 100)),
							)
						}
						type="button"
						className="p-2 rounded-lg bg-[#262626]/50 hover:bg-[#262626] backdrop-blur-lg transition-all"
					>
						<IoIosArrowDown size={13} />
					</button>
				</div>

				<div
					className={`absolute flex gap-2 items-end ${
						currentWorkspace.cover ? "bottom-[30px]" : "bottom-[10px]"
					} left-[40px] z-[10]`}
				>
					{currentWorkspace.icon ? (
						<Image
							alt="workspace_icon"
							src={`/assets/${currentWorkspace.icon}`}
							height={25}
							width={25}
							draggable={false}
							className="mb-[8px]  select-none "
						/>
					) : (
						<HiOutlineDocument />
					)}
					<div className="flex flex-col">
						<span className="text-[13px]  leading-tight opacity-65">
							Welcome to{" "}
						</span>
						<h1 className="text-[30px] leading-tight font-semibold">
							{currentWorkspaceTitle}
						</h1>
					</div>
				</div>
			</div>
		</div>
	);
};

export default WorkspaceCover;
