import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

export const connectToDb = async () => {
	try {
		const DATABASE_URI = process.env.DATABASE_URI;
		if (!DATABASE_URI) {
			throw new Error("🔴 no database url provided");
		}
		console.log("🟠 connecting to db....");
		const connection = await mongoose.connect(DATABASE_URI as string);
		console.log(`🟢 mongodb connected ${connection.connection.host}`);
	} catch (error) {
		if (error instanceof Error) {
			console.log(`🔴 failed to connect to mongodb ${error.message}`);
		}
	}
};
