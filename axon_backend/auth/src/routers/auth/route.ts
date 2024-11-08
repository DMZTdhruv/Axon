import { Router } from "express";
import {
	changePasswordController,
	changeUsernameController,
	userLogInController,
	userSignOutController,
	userSingUpController,
} from "../../controllers/user/user.controller.js";
import authenticateJsonWebToken from "../../middleware/auth.middleware.js";
import { authController } from "../../controllers/auth/auth.controller.js";

const authRouter = Router();

//sign-in and sign-out routes
authRouter.post("/sign-up", userSingUpController);
authRouter.post("/sign-in", userLogInController);
authRouter.get("/sign-out", authenticateJsonWebToken, userSignOutController);
authRouter.post(
	"/change-password",
	authenticateJsonWebToken,
	changePasswordController,
);
authRouter.post(
	"/change-username",
	authenticateJsonWebToken,
	changeUsernameController,
);

// auth route
authRouter.post("/check-auth", authController);

export default authRouter;
