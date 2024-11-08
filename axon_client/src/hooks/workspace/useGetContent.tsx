import axios from "axios";
import { toast } from "sonner";
import type { AxonError, CommonWorkspaceResponse } from "@/types";

const fetchWorkspaceContent = async (workspaceId: string) => {
	try {
		// Make GET request to fetch workspace content
		const response = await axios.get<CommonWorkspaceResponse>(
			`${process.env.NEXT_PUBLIC_API_URL}/api/workspace/content`,
			{ params: { workspaceId }, withCredentials: true },
		);
		// const goResponse = await axios.get<CommonWorkspaceResponse>(
		// 	`http://localhost:3002/workspace/${workspaceId}`,
		// 	{ params: { workspaceId }, withCredentials: true },
		// );
		// console.log(goResponse);
		console.log(response.data);
		return response.data;
	} catch (error) {
		// Handle errors and display notification with error details
		const axiosError = error as AxonError;
		toast.error("Failed to fetch workspace content", {
			description: `Error: ${axiosError.response?.data.message || "Unknown error"}`,
			className: "bg-neutral-900 border border-neutral-800",
			action: {
				label: "Close",
				onClick: () => console.log("closed error notification"),
			},
		});
	}
};

// Custom hook to access fetchWorkspaceContent function
const useGetWorkspaceContent = () => {
	return {
		fetchWorkspaceContent,
	};
};

export default useGetWorkspaceContent;
