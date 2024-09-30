"use client";

import { useAuthStore } from "@/stores/auth";
import { Skeleton } from "../ui/skeleton";

const NavbarHeader = () => {
	const { user } = useAuthStore();
	return (
		<h2 className="flex gap-[16px] items-center">
			<img src={"/assets/axon_logo.svg"} alt="axon_logo" />
			<span className="font-bold text-[20px]">
				<div>
					{user?.username ? (
						<p>{user.username}</p>
					) : (
						<Skeleton className="dark h-[24px] w-[98px]" />
					)}
				</div>
			</span>
		</h2>
	);
};

export default NavbarHeader;
