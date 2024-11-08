import type { ErrorMessageReturn } from "../types/types.js";

// helper function to return and handle error easily
export const errorMessage = (
	isError: boolean,
	errorMessage: string,
): ErrorMessageReturn => {
	return {
		error: isError,
		errorMessage,
	};
};
