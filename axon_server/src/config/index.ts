import dotenv from "dotenv";
dotenv.config();

const config = {
	app: {
		port: process.env.PORT || 3001,
		env: process.env.NODE_ENV || "development",
	},
	db: {
		uri: process.env.DB_URI,
	},
};

export default config;
