import { Router } from "express";
import { uploadImageController } from "../../controllers/workspace/uploadImage.controller.js";
import authenticateJsonWebToken from "../../middleware/auth.middleware.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
const workspaceRouter = Router();

workspaceRouter.post(
	"/upload",
	authenticateJsonWebToken,
	upload.single("image"),
	uploadImageController,
);

export default workspaceRouter;
