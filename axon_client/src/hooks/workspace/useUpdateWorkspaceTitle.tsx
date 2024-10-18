import type { IUserWorkspace } from "@/stores/workspace";
import type { AxonError } from "@/types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export type UpdateWorkspaceTitle = {
	userId: string;
	workspaceId: string;
	newTitle: string;
	oldTitle: string;
	workspaceType: "main" | "axonverse";
	updateWorkspaceTitleById: (
		workspaceId: string,
		title: string,
		workspaceType: string,
	) => void;
};

export interface UpdateWorkspaceResponse {
	statusCode: number;
	message: string;
	data: IUserWorkspace;
}

const updateWorkspaceTitle = async ({
	userId,
	workspaceId,
	newTitle,
	oldTitle,
	workspaceType,
	updateWorkspaceTitleById,
}: UpdateWorkspaceTitle) => {
	const requestBody = {
		userId,
		workspaceId,
		title: newTitle,
	};

	axios
		.post("http://localhost:3001/api/workspace/title/transaction", requestBody, {
			withCredentials: true,
		})
		.catch((error: AxonError) => {
			updateWorkspaceTitleById(workspaceId, oldTitle, workspaceType);
			console.error("Error creating workspace:", error.message);
			toast.error("Failed to change the name", {
				description: `failed to change the name from ${oldTitle} to ${newTitle}, ${error.response?.data.message}`,
				className: "bg-neutral-900 border border-neutral-800",
				action: {
					label: "Close",
					onClick: () => console.log("closed error notification"),
				},
			});
		});
};

const useUpdateWorkspaceTitle = () => {
	return { updateWorkspaceTitle };
};

export default useUpdateWorkspaceTitle;
