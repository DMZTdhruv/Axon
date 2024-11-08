import RenderBlog from "@/components/AxonEditor/RenderBlog";
import BlogCover from "@/components/ui/BlogCover";
import axios from "axios";
import React from "react";

const getBlog = async (blogId: string) => {
	try {
		const response = await axios.get(
			`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${blogId}`,
		);

		const { data } = response.data;
		return data;
	} catch (error) {
		if (error instanceof Error) {
			console.log(error.message);
		}
	}
};

const goResp = async () => {
	try {
		const goResp = await axios.get(
			"http://localhost:3002/workspace/eebf0f20-de47-4be7-b17a-ebc3be509304",
		);
		console.log(goResp.data);
		return goResp.data.content;
	} catch (error) {
		console.log(error);
	}
};

const Blog = async ({ params }: { params: { blogId: string } }) => {
	const data = await getBlog(params.blogId);
	const content = await goResp();
	console.log(content);
	console.log(data.content.content);
	return (
		<div className="min-h-screen  w-full bg-customPrimary">
			<header className="h-[50px] sticky top-0 bg-customPrimary/80 backdrop-blur-lg z-[100] flex justify-center">
				<BlogHeader />
			</header>
			{data?.content ? (
				<>
					<main className="mb-[200px] mt-[20px] relative z-0">
						<BlogCover
							cover={data.workspaceId.cover}
							icon={data.workspaceId.icon}
							title={data.workspaceId.title}
							yPos={data.workspaceId.coverPos}
						/>
						<RenderBlog
							blogContent={data.content.content}
							title={data.workspaceId.title}
						/>
					</main>
				</>
			) : (
				<>
					<p className="text-center mt-2">
						There is no blog on id {params.blogId}
					</p>
				</>
			)}
		</div>
	);
};

const BlogHeader = () => {
	return (
		<div className="flex items-center  justify-between w-full md:px-[20px] px-[16px]">
			<div className="flex gap-[8px] items-center">
				<img src={"/assets/axon_logo.svg"} alt="axon_logo" />
				<span className="font-bold text-[20px]">Axon</span>
			</div>
			<div className="flex gap-2 items-center">
				<span>11 oct 2024</span>
				<div className="w-[26px] h-[26px] rounded-full bg-gradient-to-r from-[#0077FF] to-[#42FED2]" />
			</div>
		</div>
	);
};

export default Blog;
