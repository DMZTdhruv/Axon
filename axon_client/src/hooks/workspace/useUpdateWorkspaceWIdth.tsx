import { AxonError, CommonWorkspaceResponse } from "@/types";
import axios from "axios";
import { toast } from "sonner";

type UpdateWorkspaceWidthParams = {
	workspaceId: string;
	newWidth: "sm" | "lg";
	oldWidth: "sm" | "lg";
	workspaceType: "main" | "axonverse";
	updateWorkspaceWidth: (
		workspaceId: string,
		workspaceType: "main" | "axonverse",
		width: "sm" | "lg",
	) => void;
};

const updateWorkspaceWidth = async ({
	workspaceId,
	newWidth,
	oldWidth,
	workspaceType,
	updateWorkspaceWidth,
}: UpdateWorkspaceWidthParams) => {
	const prevWidth = oldWidth;
	try {
		const response = await axios.post<CommonWorkspaceResponse>(
			`${process.env.NEXT_PUBLIC_API_URL}/api/workspace/width/transaction`,
			{
				workspaceId,
				width: newWidth,
			},
			{
				withCredentials: true,
			},
		);

		console.log(response.data);
	} catch (error) {
		const axiosError = error as AxonError;
		toast.error("Failed to update the width", {
			description: `Error: ${axiosError.response?.data.message || "Unknown error"}`,
			className: "bg-neutral-900 border border-neutral-800",
			action: {
				label: "Close",
				onClick: () => console.log("closed error notification"),
			},
		});

		// Revert width to the previous value on error
		updateWorkspaceWidth(workspaceId, workspaceType, prevWidth);
		console.log(error);
	}
};

const useUpdateWorkspaceWIdth = () => {
	return {
		updateWorkspaceWidth,
	};
};

export default useUpdateWorkspaceWIdth;
