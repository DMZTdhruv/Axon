import { type SanityClient, createClient } from "@sanity/client";
import dotenv from "dotenv";
dotenv.config();

if (
	!process.env.SANITY_PROJECT_ID ||
	!process.env.SANITY_DATASET ||
	!process.env.SANITY_TOKEN
) {
	throw new Error(
		"🔴 Failed to create sanity client, Missing sanity environment variables.",
	);
}

export const client: SanityClient = createClient({
	projectId: process.env.SANITY_PROJECT_ID,
	dataset: process.env.SANITY_DATASET,
	token: process.env.SANITY_TOKEN,
	useCdn: true,
});
