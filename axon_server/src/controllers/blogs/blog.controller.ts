import type { Request, Response } from "express";
import { internalServerErrorResponse } from "../../constant.js";
import {
	createBlogService,
	deleteBlogService,
	getBlogService,
	updateBlogService,
} from "../../service/blogs/blog.service.js";
import { validateCommonValues } from "../../validators/workspace.validator.js";

const createBlogController = async (req: Request, res: Response) => {
	try {
		const user = req.user;
		const { workspaceId } = req.body;

		const validate = validateCommonValues(user._id, workspaceId);
		if (validate.error) {
			return res.status(400).json({ error: validate.errorMessage });
		}

		const { statusCode, response } = await createBlogService({
			userId: user._id,
			workspaceId,
		});

		console.log(response);
		return res.status(statusCode).json(response);
	} catch (error) {
		if (error instanceof Error) {
			console.log(`Error in createBlogController ${error.message}`);
		}
		return res.status(500).json(internalServerErrorResponse);
	}
};

export const updateBlogContentController = async (
	req: Request,
	res: Response,
) => {
	try {
		const user = req.user;
		const { blogId } = req.body;

		const validate = validateCommonValues(user._id, blogId);
		if (validate.error) {
			return res.status(400).json({ error: validate.errorMessage });
		}

		const { statusCode, response } = await updateBlogService(user._id, blogId);

		console.log(response);
		return res.status(statusCode).json(response);
	} catch (error) {
		if (error instanceof Error) {
			console.log(`Error in updating blog ${error.message}`);
		}
		return res.status(500).json(internalServerErrorResponse);
	}
};

export const getBlogController = async (req: Request, res: Response) => {
	try {
		const { blogId } = req.params;

		if (!blogId) {
			return res.status(400).json({ error: "Incomplete data provided" });
		}

		const { statusCode, response } = await getBlogService(blogId);

		return res.status(statusCode).json(response);
	} catch (error) {
		if (error instanceof Error) {
			console.log(`Error in updating blog ${error.message}`);
		}
		return res.status(500).json(internalServerErrorResponse);
	}
};

export const deleteABlogController = async (req: Request, res: Response) => {
	try {
		const { blogId } = req.params;
		const user = req.user;

		console.log({
			blogId,
			user: user._id,
		});
		if (!blogId || !user._id) {
			return res.status(400).json({ error: "Incomplete data provided" });
		}

		const { statusCode, response } = await deleteBlogService(blogId, user._id);

		return res.status(statusCode).json(response);
	} catch (error) {
		if (error instanceof Error) {
			console.log(`Error in deleting a blog ${error.message}`);
		}
		return res.status(500).json(internalServerErrorResponse);
	}
};

export default createBlogController;
