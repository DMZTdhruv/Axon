import WorkspaceBanner from "@/components/workspace/WorkspaceBanner";

const Page = ({ params }: { params: { id: string; type: string } }) => {
	return (
		<div className=" bg-customMain text-white w w-full">
			<WorkspaceBanner workspaceId={params.id} workspaceType={params.type} />
		</div>
	);
};

export default Page;
