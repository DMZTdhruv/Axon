import AxonWorkspace from "@/components/workspace/AxonWorkspace";

const Page = ({ params }: { params: { id: string; type: string } }) => {
	return (
		<div className=" bg-customMain  text-white w w-full">
			<AxonWorkspace workspaceId={params.id} workspaceType={params.type} />
		</div>
	);
};

export default Page;
