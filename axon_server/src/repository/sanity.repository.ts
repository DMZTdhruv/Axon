import { client } from "../db/sanity.js";
import fs from "node:fs";
import type { UploadImageParams, UploadImageReturn } from "../types.js";

export class SanityRepository {
	async uploadImage({
		file,
		workspaceId,
		userId,
	}: UploadImageParams): Promise<UploadImageReturn> {
		const imageFile = fs.createReadStream(file.path);
		try {
			const imageAsset = await client.assets.upload("image", imageFile, {
				filename: file.originalname,
			});

			fs.unlinkSync(file.path);

			const doc = await client.create({
				_type: "imageSchema",
				workspaceImage: {
					_type: "image",
					asset: {
						_type: "reference",
						_ref: imageAsset._id,
					},
				},
				workspaceId,
				uploadedBy: userId,
			});

			return { imageId: doc._id, url: imageAsset.url };
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(
					`🔴 Error ocurred in the uploadImage - sanity SanityRepository  ${error.message}`,
				);
			}
			throw new Error("An unknown error occurred in uploadImage");
		} finally {
			imageFile.destroy();
		}
	}
}
