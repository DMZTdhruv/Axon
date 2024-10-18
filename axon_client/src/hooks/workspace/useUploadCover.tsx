import type { AxonError } from "@/types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface UploadCoverResponse {
	statusCode: number;
	message: string;
	data: {
		imageId: string;
		url: string;
	};
}

// extension for the Axios error
interface UploadCoverRequest {
	workspaceId: string;
	file: File;
}

const uploadCover = async (
	data: UploadCoverRequest,
): Promise<UploadCoverResponse> => {
	const formData = new FormData();
	formData.append("workspaceId", data.workspaceId);
	formData.append("image", data.file);

	const response = await axios.post(
		"http://localhost:3001/api/workspace/cover/upload/transaction",
		formData,
		{
			withCredentials: true,
			headers: {
				"Content-Type": "multipart/form-data",
			},
		},
	);

	return response.data;
};

const useUploadCover = () => {
	return useMutation<UploadCoverResponse, AxonError, UploadCoverRequest>({
		mutationFn: uploadCover,
	});
};

export default useUploadCover;