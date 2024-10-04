import { Router } from "express";
import { uploadImageController } from "../../controllers/workspace/uploadImage.controller.js";
import authenticateJsonWebToken from "../../middleware/auth.middleware.js";
import multer from "multer";
import { createParentWorkspaceController } from "../../controllers/workspace/createParentWorkspace.controller.js";
import { getParentWorkspacesController } from "../../controllers/workspace/getParentWorkspaces.controller.js";
import updateWorkspaceTitleController from "../../controllers/workspace/updateWorkspaceTitle.controller.js";
import deleteWorkspaceController from "../../controllers/workspace/deleteWorkspace.controller.js";
const upload = multer({ dest: "uploads/" });
const workspaceRouter = Router();

//handle GET
workspaceRouter.get(
	"/workspaces",
	authenticateJsonWebToken,
	getParentWorkspacesController,
);

//handle post
workspaceRouter.post(
	"/create-parent-workspace",
	authenticateJsonWebToken,
	createParentWorkspaceController,
);
workspaceRouter.post(
	"/delete/:workspaceId",
	authenticateJsonWebToken,
	deleteWorkspaceController,
);
workspaceRouter.post(
	"/title/update",
	authenticateJsonWebToken,
	updateWorkspaceTitleController,
);

//handle Post
// handle workspace image uploads
workspaceRouter.post(
	"/upload",
	authenticateJsonWebToken,
	upload.single("image"),
	uploadImageController,
);

export default workspaceRouter;
