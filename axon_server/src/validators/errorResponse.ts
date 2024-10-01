import type { ErrorMessageReturn } from "../types.js";

export const errorMessage = (
	isError: boolean,
	errorMessage: string,
): ErrorMessageReturn => {
	return {
		error: isError,
		errorMessage,
	};
};