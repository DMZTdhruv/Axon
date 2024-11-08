import { AxonError } from "@/types";
import axios from "axios";
import React from "react";
import { toast } from "sonner";

const handleRemoveCoverFromServer = async ({
	workspaceId,
}: { workspaceId: string }) => {
	try {
		const res = await axios.delete(
			`${process.env.NEXT_PUBLIC_API_URL}/api/workspace/cover/remove/${workspaceId}`,
			{ withCredentials: true },
		);
		console.log(res.data);
	} catch (error) {
		const axiosError = error as AxonError;
		toast.error("Failed to remove workspace cover", {
			description: `Error: ${axiosError.response?.data.message || "Unknown error"}`,
			className: "bg-neutral-900 border border-neutral-800",
			action: {
				label: "Close",
				onClick: () => console.log("closed error notification"),
			},
		});
        throw new Error(axiosError.message)
	}
};

const useRemoveCover = () => {
	return { handleRemoveCoverFromServer };
};

export default useRemoveCover;
