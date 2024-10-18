import express from "express";
import { connectToDb } from "./db/db.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import authRouter from "./routers/auth/route.js";
import workspaceRouter from "./routers/workspace/route.js";
// import { SanityRepository } from "./repository/sanity.repository.js";

// connecting to database
const main = async () => {
	await connectToDb();
	const app = express();
	const port: number = 3001;

	// const ids = [
	// 	"763b2fae-593a-4091-99db-5c04d5b248dd",
	// 	"b52861b9-5702-4b7a-b941-95ae067777d0",
	// 	"67cf881d-983f-4472-8c65-9cb7e948252a",
	// 	"50f750be-ec31-4559-9ab7-4f2cc016145a",
	// 	"4048548f-55d7-420a-9356-5598e5951251",
	// 	"77fc0b3a-9d4b-486a-9bcf-44976070ee10",
	// 	"2fd22d37-4a59-47b6-9ec9-3af4d832d1da",
	// 	"6119e43a-c76a-4749-87f0-babbf8c3b60b",
	// 	"5fed108d-48eb-4a7f-ae23-4c5d76252717",
	// 	"d23d3795-6611-413f-996c-e446d011dc1c",
	// ];

	// const sanityRepo = new SanityRepository();

	// ids.forEach(async (id) => {
	// 	await sanityRepo.deleteImages(id);
	// });

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
		max: 500,
		standardHeaders: true,
		legacyHeaders: false,
		message: "Too many requests, please try again later.",
		skipSuccessfulRequests: true,
	});

	app.use(limiter);
	app.use("/api/auth", authRouter);
	app.use("/api/workspace", workspaceRouter);

	app.listen(port, () => {
		console.log("Server is running on port http://localhost:3001");
	});
};

main();
