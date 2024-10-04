import type { IUserWorkspace } from "@/stores/workspace";
import type { AxonError } from "@/types";
import axios from "axios";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export type DeleteWorkspaceTypes = {
	workspaceId: string;
	workspaceType: "main" | "axonverse";
};

export interface DeleteWorkspaceResponse {
	statusCode: number;
	message: string;
	data: IUserWorkspace;
}

const useDeleteWorkspace = () => {
	const queryClient = useQueryClient();
	const deleteWorkspaceById = async ({ workspaceId }: DeleteWorkspaceTypes) => {
		try {
			const response = await axios.post<DeleteWorkspaceResponse>(
				`http://localhost:3001/api/workspace/delete/${workspaceId}`,
				{},
				{ withCredentials: true },
			);

			console.log(response.data);
		} catch (error: unknown) {
			const axiosError = error as AxonError;

			console.error("Error deleting workspace:", axiosError.message);
			toast.error("Failed to delete workspace", {
				description: `Error: ${axiosError.response?.data.message || "Unknown error"}`,
				className: "bg-neutral-900 border border-neutral-800",
				action: {
					label: "Close",
					onClick: () => console.log("closed error notification"),
				},
			});
			queryClient.refetchQueries({ queryKey: ["workspaces"] });
		}
	};

	return { deleteWorkspaceById };
};

export default useDeleteWorkspace;
