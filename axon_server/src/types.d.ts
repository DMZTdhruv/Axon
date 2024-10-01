export type TValidateResponse = {
	error: boolean;
	errorMessage: string;
};

export type ErrorMessageReturn = {
	error: boolean;
	errorMessage: string;
};

interface UploadedFile extends Express.Multer.File {}
export interface UploadImageParams {
	file: UploadedFile;
	workspaceId: string;
	userId: string;
}

export type UploadImageReturn = {
	imageId: string;
	url: string;
};
