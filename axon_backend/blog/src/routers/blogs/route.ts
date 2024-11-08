import { Router } from "express";
import authenticateJsonWebToken from "../../middleware/auth.middleware.js";
import createBlogController, {
	deleteABlogController,
	getBlogController,
	updateBlogContentController,
} from "../../controllers/blogs/blog.controller.js";

const blogRouter = Router();

// post routes
blogRouter.post("/create", authenticateJsonWebToken, createBlogController);
blogRouter.post(
	"/update",
	authenticateJsonWebToken,
	updateBlogContentController,
);

//get routes
blogRouter.get("/:blogId", getBlogController);

// delete routes
blogRouter.delete(
	"/delete/:blogId",
	authenticateJsonWebToken,
	deleteABlogController,
);

export default blogRouter;
