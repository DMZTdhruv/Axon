import { API_URL } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import axios, { type AxiosError } from "axios";

interface UploadCoverResponse {
	statusCode: number;
	message: string;
	data: {
		imageId: string;
		url: string;
	};
}

// extension for the Axios error 
type AxonErrorResponse = {
	message: string;
};

type AxonError = AxiosError<AxonErrorResponse>;
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

	console.log(`${API_URL}/api/workspace/upload`);

	const response = await axios.post(
		"http://localhost:3001/api/workspace/upload",
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
