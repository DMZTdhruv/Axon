export default {
	name: "imageSchema",
	title: "Image Schema",
	type: "document",
	fields: [
		{
			name: "workspaceImage",
			title: "Workspace Image",
			type: "image",
		},
		{
			name: "workspaceId",
			title: "Workspace Id",
			type: "string",
		},
		{
			name: "uploadedBy",
			title: "uploaded by",
			type: "string",
		},
	],
};
