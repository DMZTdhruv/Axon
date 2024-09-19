export type TResponse = {
	message: string;
	success: boolean;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	data: any;
};

export type TAxonResponse = {
	statusCode: number;
	response: TResponse;
};

const axonResponse = (statusCode: number, response: TResponse): TAxonResponse => {
	return {
		statusCode,
		response,
	};
};

export default axonResponse;
