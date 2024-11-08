import { BlogRepository } from "../../repository/blog.repository.js";
import { CommonBlogParams } from "../../types/types.js";
import axonResponse from "../../utils/axonResponse.js";

const blogRepo = new BlogRepository();

export const createBlogService = async ({
	userId,
	workspaceId,
}: CommonBlogParams) => {
	try {
		const { isError, blog } = await blogRepo.createBlog({
			userId,
			workspaceId,
		});

		if (isError.error) {
			return axonResponse(400, {
				status: "error",
				data: null,
				message: isError.errorMessage,
			});
		}

		if (blog === null) {
			return axonResponse(400, {
				status: "error",
				data: null,
				message: "failed to create blog",
			});
		}

		return axonResponse(201, {
			status: "success",
			data: {
				blogId: blog._id,
				workspaceId: blog.workspaceId,
			},
			message: "blog created successfully",
		});
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		}
		throw new Error("unknown error occurred");
	}
};

export const getBlogService = async (workspaceId: string) => {
	try {
		const { isError, blog: blogData } = await blogRepo.getBlog(workspaceId);

		if (isError.error) {
			return axonResponse(400, {
				status: "error",
				data: null,
				message: isError.errorMessage,
			});
		}
		return axonResponse(201, {
			status: "success",
			data: blogData,
			message: "Blog received successfully",
		});
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		}
		throw new Error("unknown error occurred");
	}
};

export const updateBlogService = async (userId: string, blogId: string) => {
	try {
		const { isError, blog: blogData } = await blogRepo.updateBlog({
			userId,
			blogId,
		});

		if (isError.error) {
			return axonResponse(400, {
				status: "error",
				data: null,
				message: isError.errorMessage,
			});
		}
		return axonResponse(201, {
			status: "success",
			data: blogData,
			message: "updated the blog content successfully",
		});
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		}
		throw new Error("unknown error occurred");
	}
};

export const deleteBlogService = async (blogId: string, userId: string) => {
	try {
		const { isError, blog: blogData } = await blogRepo.deleteABlog(
			blogId,
			userId,
		);

		if (isError.error) {
			return axonResponse(400, {
				status: "error",
				data: null,
				message: isError.errorMessage,
			});
		}

		return axonResponse(201, {
			status: "success",
			data: blogData,
			message: "blog was deleted successfully",
		});
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		}
		throw new Error("unknown error occurred");
	}
};
