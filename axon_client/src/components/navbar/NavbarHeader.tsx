"use client";

import { useAuthStore } from "@/stores/auth";

const NavbarHeader = () => {
	const { username } = useAuthStore();
	return (
		<h2 className="flex gap-[16px]">
			<img src={"/assets/axon_logo.svg"} alt="axon_logo" />
			<span className=" font-bold text-[20px]">
				{username === "" ? (
					<div className="h-full w-[80px] rounded-md animate-pulse bg-neutral-900" />
				) : (
					<p>{username}</p>
				)}
			</span>
		</h2>
	);
};

export default NavbarHeader;
