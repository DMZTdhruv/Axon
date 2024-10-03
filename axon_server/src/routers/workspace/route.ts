import { Router } from "express";
import { uploadImageController } from "../../controllers/workspace/uploadImage.controller.js";
import authenticateJsonWebToken from "../../middleware/auth.middleware.js";
import multer from "multer";
import { createWorkspaceController } from "../../controllers/workspace/createWorkspace.controller.js";
const upload = multer({ dest: "uploads/" });
const workspaceRouter = Router();

//handle workspace creation
workspaceRouter.post(
	"/create-parent-workspace",
	authenticateJsonWebToken,
	createWorkspaceController
)

// handle workspace image uploads
workspaceRouter.post(
	"/upload",
	authenticateJsonWebToken,
	upload.single("image"),
	uploadImageController,
);

export default workspaceRouter;
