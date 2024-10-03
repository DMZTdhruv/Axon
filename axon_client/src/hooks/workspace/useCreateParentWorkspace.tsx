import type { IUserWorkspace } from "@/stores/workspace";
import type { AxonError } from "@/types";
import axios from "axios";
import { toast } from "sonner";

export interface CreateParentWorkspaceResponse {
	statusCode: number;
	message: string;
	data: IUserWorkspace;
}
export interface CreateParentWorkspaceRequest {
	_id: string;
	workspace: "main" | "axonverse";
	createdBy: string;
	removeWorkspace: (
		workspaceId: string,
		workspaceType: "main" | "axonverse",
	) => void;
}

const createParentWorkspace = ({
	_id,
	workspace,
	createdBy,
	removeWorkspace,
}: CreateParentWorkspaceRequest) => {
	const workspaceData = {
		_id,
		workspace,
		createdBy,
	};
	axios
		.post(
			"http://localhost:3001/api/workspace/create-parent-workspace",
			workspaceData,
			{
				withCredentials: true,
			},
		)
		.then((data) => {
			console.log(data);
		})
		.catch((error: AxonError) => {
			removeWorkspace(_id, workspace);
			console.error("Error creating workspace:", error.message);
			toast.error(error.response?.data?.message || error.message, {
				description: `Failed to create the workspace with id: ${_id}`,
				className: "bg-neutral-900 border border-neutral-800",
				action: {
					label: "Close",
					onClick: () => console.log("closed error notification"),
				},
			});
		});
};

const useCreateNewParentWorkspace = () => {
	return { createParentWorkspace };
};

export default useCreateNewParentWorkspace;
