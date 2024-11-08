export type TResponse = {
	message: string;
	status: "success" | "error";
	data: any;
};

export type TAxonResponse = {
	statusCode: number;
	response: TResponse;
};

const axonResponse = (
	statusCode: number,
	response: TResponse,
): TAxonResponse => {
	return {
		statusCode,
		response,
	};
};

export default axonResponse;