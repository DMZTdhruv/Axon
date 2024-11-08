import Header from "@/components/home/header";
import dynamic from "next/dynamic";
const DynamicMainNavigation = dynamic(
	() => import("@/components/home/mainNavigation"),
);
const DynamicSearchWorkspace = dynamic(
	() => import("@/components/ui/SearchWorkspace"),
);

const Page = () => {
	return (
		<main className="w-full bg-customMain text-white">
			{/* search workspace to find the workspace */}
			<DynamicSearchWorkspace />
			<Header />
			<DynamicMainNavigation />
		</main>
	);
};

export default Page;