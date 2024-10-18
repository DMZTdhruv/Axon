import { useCallback, useMemo, useState, useTransition } from "react";
import * as Icons from "react-icons/fa";
import { Input } from "../ui/input";
import useUpdateWorkspaceIcon from "@/hooks/workspace/useUpdateWorkspaceIcon";
import { FiSearch } from "react-icons/fi";

const IconModal = ({
	handleSelectedIcon,
	workspaceId,
	currentIcon
}: { handleSelectedIcon: (icon: string | null) => void; workspaceId: string, currentIcon: string | null }) => {
	const { updateIcon } = useUpdateWorkspaceIcon();
	const [searchTerm, setSearchTerm] = useState("");
	const [isPending, startTransition] = useTransition();

	const filteredIcons = useMemo(
		() =>
			Object.entries(Icons).filter(([name]) =>
				name.toLowerCase().includes(searchTerm.toLowerCase()),
			),
		[searchTerm],
	);

	const handleSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setSearchTerm(e.target.value);
		},
		[],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const handleIconClick = useCallback(
		(name: string | null) => {
			const svgString = "";
			handleSelectedIcon(name);
			updateIcon({
				workspaceId,
				iconName: name
			})
		},
		[handleSelectedIcon],
	);

	return (
		<div className="rounded-[8px] top-[10px] overflow-x-hidden overflow-y-hidden p-[14px] absolute z-[1] backdrop-blur-lg border border-neutral-700 bg-customPrimary/80 w-[355px] h-[244px]">
			<div className="flex w-full relative justify-between gap-2">
				<Input
					placeholder="Search for icon..."
					className="rounded-[5px] pl-8 focus-visible:ring-offset-0 focus-visible:ring-0 placeholder:text-neutral-600 bg-neutral-900 border border-neutral-700 h-[30px]"
					value={searchTerm}
					onChange={handleSearchChange}
				/>
				<FiSearch className="absolute top-2 left-2 text-neutral-600" />
				{/* <div className="h-[30px] bg-neutral-900 flex justify-center items-center aspect-square rounded-[5px] border border-[#2F2F2F]">
					<div className="h-[15px] rounded-full aspect-square bg-white" />
				</div> */}
			</div>
			<div className="w-full">
				<div className="text-[13px] pt-[10px] flex justify-between items-center">
					<p className=" text-neutral-400">Icons</p>
					{currentIcon !== null &&
						<button type="button" className=" text-neutral-400 hover:text-white" onClick={() => handleIconClick(null)}>
							Remove
						</button>}
				</div>
				<div className="h-[145px] mt-[5px] flex gap-1 flex-wrap overflow-y-auto items-start content-start">
					{filteredIcons.map(([name, Icon]) => {
						return (
							// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
							<div
								key={name}
								className="text-neutral-400 h-[24px] w-[24px] hover:text-white transition-all p-1 rounded-md hover:bg-neutral-700 cursor-pointer"
								onClick={() => handleIconClick(name)}
							>
								<Icon />
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default IconModal;
