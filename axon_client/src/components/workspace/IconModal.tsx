import React, {
	useCallback,
	useMemo,
	useState,
	useRef,
	useEffect,
	SetStateAction,
} from "react";
import * as Icons from "react-icons/fa";
import { Input } from "../ui/input";
import useUpdateWorkspaceIcon from "@/hooks/workspace/useUpdateWorkspaceIcon";
import { FiSearch } from "react-icons/fi";

const ICONS_PER_PAGE = 100;

const IconModal = ({
	handleSelectedIcon,
	workspaceId,
	currentIcon,
	setIconModal,
}: {
	handleSelectedIcon: (icon: string | null) => void;
	workspaceId: string;
	currentIcon: string | null;
	setIconModal: React.Dispatch<SetStateAction<boolean>>;
}) => {
	const { updateIcon } = useUpdateWorkspaceIcon();
	const [searchTerm, setSearchTerm] = useState("");
	const [visibleIcons, setVisibleIcons] = useState<
		[string, React.ComponentType][]
	>([]);
	const [page, setPage] = useState(0);
	const modalRef = useRef<HTMLDivElement>(null);

	const containerRef = useRef<HTMLDivElement>(null);

	const filteredIcons = useMemo(() => {
		return Object.entries(Icons).filter(([name]) =>
			name.toLowerCase().includes(searchTerm.toLowerCase()),
		);
	}, [searchTerm]);

	const loadMoreIcons = useCallback(() => {
		const startIndex = page * ICONS_PER_PAGE;
		const endIndex = startIndex + ICONS_PER_PAGE;
		const newIcons = filteredIcons.slice(startIndex, endIndex);
		setVisibleIcons((prevIcons) => [...prevIcons, ...newIcons]);
		setPage((prevPage) => prevPage + 1);
	}, [page, filteredIcons]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setVisibleIcons([]);
		setPage(0);
	}, [searchTerm]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				modalRef.current &&
				!modalRef.current.contains(event.target as Node)
			) {
				setIconModal(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [setIconModal]);

	useEffect(() => {
		if (page === 0) {
			loadMoreIcons();
		}
	}, [page, loadMoreIcons]);

	const handleScroll = useCallback(() => {
		if (containerRef.current) {
			const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
			if (scrollTop + clientHeight >= scrollHeight - 20) {
				loadMoreIcons();
			}
		}
	}, [loadMoreIcons]);

	const handleSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setSearchTerm(e.target.value);
		},
		[],
	);

	const handleIconClick = useCallback(
		(name: string | null) => {
			handleSelectedIcon(name);
			updateIcon({
				workspaceId,
				iconName: name,
			});
		},
		[handleSelectedIcon, updateIcon, workspaceId],
	);

	return (
		<div
			ref={modalRef}
			className="rounded-[8px] top-[10px] overflow-x-hidden overflow-y-hidden p-[14px] absolute z-[1] border border-neutral-700 bg-neutral-900 w-[355px] h-[244px]"
		>
			<div className="flex w-full relative justify-between gap-2">
				<Input
					placeholder="Search for icon..."
					className="rounded-[5px] pl-8 focus-visible:ring-offset-0 focus-visible:ring-0 placeholder:text-neutral-600 bg-neutral-900 border border-neutral-700 h-[30px]"
					value={searchTerm}
					onChange={handleSearchChange}
				/>
				<FiSearch className="absolute top-2 left-2 text-neutral-600" />
			</div>
			<div className="w-full">
				<div className="text-[13px] pt-[10px] flex justify-between items-center">
					<p className="text-neutral-400">Icons</p>
					{currentIcon !== null && (
						<button
							type="button"
							className="text-neutral-400 hover:text-white"
							onClick={() => handleIconClick(null)}
						>
							Remove
						</button>
					)}
				</div>
				<div
					ref={containerRef}
					className="h-[145px] mt-[5px] flex gap-1 flex-wrap overflow-y-auto items-start content-start"
					onScroll={handleScroll}
				>
					{visibleIcons.map(([name, Icon]) => (
						// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
						<div
							key={name}
							className="text-neutral-400 h-[24px] transition-transform duration-75 w-[24px] hover:text-white hover:scale-[1.2] p-1 rounded-md hover:bg-neutral-700 cursor-pointer"
							onClick={() => handleIconClick(name)}
						>
							<Icon />
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default IconModal;
