import type { AxonError } from "@/types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface UpdateYPosCoverResponse {
	status: string;
	statusCode: number;
	message: string;
	data: {
		imageId: string;
		url: string;
	};
}
// extension for the Axios error
interface UpdateCoverRequest {
	workspaceId: string;
	yPos: number;
}

const updateCoverYPosOnServer = async ({
	yPos,
	workspaceId,
}: UpdateCoverRequest): Promise<UpdateYPosCoverResponse> => {
	const response = await axios.post(
		`${process.env.NEXT_PUBLIC_API_URL}/api/workspace/cover/yPos/transaction`,
		{
			yPos,
			workspaceId,
		},
		{
			withCredentials: true,
			headers: {
				"Content-Type": "application/json",
			},
		},
	);

	return response.data;
};

const useUpdateYCoverPosition = () => {
	return useMutation<UpdateYPosCoverResponse, AxonError, UpdateCoverRequest>({
		mutationFn: updateCoverYPosOnServer,
	});
};

export default useUpdateYCoverPosition;
