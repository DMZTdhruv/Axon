import express from "express";
import { connectToDb } from "./db/db.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import authRouter from "./routers/auth/route.js";
import workspaceRouter from "./routers/workspace/route.js";

// connecting to database
const main = async () => {
	await connectToDb();
	const app = express();
	const port: number = 3001;
	
	app.use(
		cors({
			origin: ["http://localhost:3000"],
			credentials: true,
		}),
	);

	app.use(helmet());
	app.use(express.json());
	app.use(cookieParser());
	app.use(morgan("dev"));
	const limiter = rateLimit({
		windowMs: 15 * 60 * 1000,
		max: 100,
		standardHeaders: true,
		legacyHeaders: false,
		message: "Too many requests, please try again later.",
	});

	app.use(limiter);
	app.use("/api/auth", authRouter);
	app.use("/api/workspace", workspaceRouter);

	app.listen(port, () => {
		console.log("Server is running on port http://localhost:3001");
	});
};

main();
