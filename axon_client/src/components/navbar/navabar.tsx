import type { TMenuItem, TWorkspaceItems } from "@/types";
import React from "react";
import NavLink from "./navlink";
import NavbarHeader from "./NavbarHeader";
import WorkspaceSection from "./WorkspaceSection";
import Search from "./Search";

const Navbar = () => {
	const menuItems: TMenuItem[] = [
		{
			_id: "hello",
			icon: "homeIcon.svg",
			title: "Home",
			url: "home",
		},
		{
			_id: "hello",
			icon: "settingIcon.svg",
			title: "Settings",
			url: "setting",
		},
	];

	return (
		<nav className="sticky z-[100] border-r-2 border-[#262626] flex-shrink-0 bg-customPrimary top-0 left-0 w-[250px]  h-screen max-h-svh py-[25px] px-[20px]">
			<div className="flex flex-col gap-[25px] h-full">
				<NavbarHeader />
				<div className="flex flex-col gap-[12px]">
					<Search />
					{menuItems.map((menuLink) => {
						return <NavLink key={menuLink.title} link={menuLink} />;
					})}
				</div>
				<div className="flex flex-col gap-[18px]">
					<WorkspaceSection />
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
