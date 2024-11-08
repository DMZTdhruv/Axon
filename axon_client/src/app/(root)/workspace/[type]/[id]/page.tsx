import dynamic from "next/dynamic";
const DynamicSearchWorkspace = dynamic(
	() => import("@/components/ui/SearchWorkspace"),
);
const DynamicAxonWorkspace = dynamic(
	() => import("@/components/workspace/AxonWorkspace"),
);

// getting workspace through params id
const Page = ({ params }: { params: { id: string; type: string } }) => {
	return (
		<div className=" bg-customMain  text-white w w-full">
			{/* search workspace to find the workspace */}
			<DynamicSearchWorkspace />

			{/* Displaying Axon workspace */}
			<DynamicAxonWorkspace
				workspaceId={params.id}
				workspaceType={params.type}
			/>
		</div>
	);
};

export default Page;
