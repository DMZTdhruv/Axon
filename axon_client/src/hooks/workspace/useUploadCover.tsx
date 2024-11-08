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
	const formData = new FormData(); // Create a new FormData object
	formData.append("workspaceId", data.workspaceId); // Append workspace ID to form data
	formData.append("image", data.file); // Append the image file to form data

	const response = await axios.post(
		`${process.env.NEXT_PUBLIC_API_URL}/api/workspace/cover/upload/transaction`,
		formData,
		{
			withCredentials: true,
			headers: {
				"Content-Type": "multipart/form-data", // Set content type for file upload
			},
		},
	);

	return response.data;
};

const useUploadCover = () => {
	return useMutation<UploadCoverResponse, AxonError, UploadCoverRequest>({
		mutationFn: uploadCover, // The function to call for the mutation,
	});
};

export default useUploadCover;
