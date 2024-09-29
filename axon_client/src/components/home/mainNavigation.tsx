"use client";

import { useWorkspaceStore } from "@/stores/workspace";
import type { TNavigationWorkspaceContent } from "@/types";
import Image from "next/image";
import Link from "next/link";

const MainNavigation = () => {
	const workspaceStore = useWorkspaceStore();
	const mainWorkspaceList: TNavigationWorkspaceContent[] =
		workspaceStore.workspace.main.map((workspace) => {
			return {
				_id: workspace._id,
				title: workspace.title,
				cover: workspace.cover,
				icon: workspace.icon,
				workspaceType: workspace.workspace,
			};
		});
	const everythingWorkspaceList: TNavigationWorkspaceContent[] =
		workspaceStore.workspace.everything.map((workspace) => {
			return {
				_id: workspace._id,
				title: workspace.title,
				cover: workspace.cover,
				icon: workspace.icon,
				workspaceType: workspace.workspace,
			};
		});

	return (
		<div className="px-[40px] py-[20px] space-y-[20px]">
			<h2 className="font-bold text-[18px]">
				Navigate easily to any page here
			</h2>
			<div className="flex gap-[20px] flex-col">
				<div className="flex flex-col gap-[10px]">
					<p className="text-[#595959] text-[13px]">Main</p>
					<div className="flex gap-[10px] -translate-x-[5px]">
						{mainWorkspaceList.map((mainNavItems) => (
							<NavItems
								workspaceType={mainNavItems.workspaceType}
								key={mainNavItems._id}
								_id={mainNavItems._id}
								title={mainNavItems.title}
								cover={mainNavItems.cover}
								icon={mainNavItems.icon}
							/>
						))}
					</div>
				</div>
				<div className="flex flex-col gap-[10px]">
					<p className="text-[#595959] text-[13px]">Everything</p>
					<div className="flex gap-[10px] -translate-x-[5px]">
						{everythingWorkspaceList.map((mainNavItems) => (
							<NavItems
								workspaceType={mainNavItems.workspaceType}
								key={mainNavItems._id}
								_id={mainNavItems._id}
								title={mainNavItems.title}
								cover={mainNavItems.cover}
								icon={mainNavItems.icon}
							/>
						))}
					</div>
				</div>
				{workspaceStore.workspace.recent && (
					<div className="flex flex-col gap-[10px]">
						<p className="text-[#595959] text-[13px]">Recently visited</p>
						<div className="flex gap-[10px] -translate-x-[5px]">
							{workspaceStore.workspace.recent.map((recentWorkspace) => {
								return (
									<Link
										key={recentWorkspace._id}
										href={`/workspace/${recentWorkspace.workspaceType}/${recentWorkspace._id}`}
										className="flex items-center hover:bg-neutral-800 transition-all rounded-lg px-2 py-1 gap-[10px]"
									>
										<Image
											alt={`nav_${recentWorkspace.title}`}
											src={`/assets/${recentWorkspace.icon}`}
											height={16}
											width={16}
											unoptimized
											className=" -translate-y-[1px]"
										/>
										<span className="text-[15px]  leading-tight">
											{recentWorkspace.title}
										</span>
									</Link>
								);
							})}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

const NavItems = ({
	_id,
	title,
	cover,
	icon,
	workspaceType,
}: TNavigationWorkspaceContent) => {
	const workspaceStore = useWorkspaceStore();

	return (
		<Link
			onClick={() => {
				workspaceStore.addNewRecentWorkspace(
					_id,
					workspaceType,
					title ? title : "undefined",
					icon ? icon : "axon_logo.svg",
					cover ? cover : "",
				);
			}}
			href={`/workspace/${workspaceType}/${_id}`}
			className="flex items-center hover:bg-neutral-800 transition-all rounded-lg px-2 py-1 gap-[10px]"
		>
			<Image
				alt={`nav_${title}`}
				src={`/assets/${icon}`}
				height={16}
				width={16}
				unoptimized
				className=" -translate-y-[1px]"
			/>
			<span className="text-[15px]  leading-tight">{title}</span>
		</Link>
	);
};

export default MainNavigation;
