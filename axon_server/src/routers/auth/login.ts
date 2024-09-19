import { Router } from "express";
import { userLogInController, userSignOutController, userSingUpController } from "../../controllers/user.controller.js";
import authenticateJsonWebToken from "../../middleware/auth.middleware.js";
import { authController } from "../../controllers/auth/auth.controller.js";

const router = Router();

//sign-in and sign-out routes
router.post("/sign-up", userSingUpController);
router.post("/sign-in", userLogInController);
router.post("/sign-out", authenticateJsonWebToken, userSignOutController);

// auth route
router.post("/check-auth", authController);

export default router;