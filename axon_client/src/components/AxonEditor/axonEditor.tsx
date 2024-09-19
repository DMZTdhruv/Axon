"use client";
import { useEffect, useState } from "react";
import {
	EditorRoot,
	EditorCommand,
	EditorCommandItem,
	EditorCommandEmpty,
	EditorContent,
	EditorCommandList,
	EditorBubble,
	type EditorInstance,
} from "novel";

import { ImageResizer, handleCommandNavigation } from "novel/extensions";
import { useDebouncedCallback } from "use-debounce";

import { Separator } from "@/components/ui/separator";
import { defaultExtensions } from "./extension";
import { slashCommand, suggestionItems } from "./slashCommand";
import { NodeSelector } from "./selectors/node-selector";
import { LinkSelector } from "./selectors/link-selector";
import { TextButtons } from "./selectors/text-button";
import { ColorSelector } from "./selectors/color-selector";
import { type IUserWorkspace, useWorkspaceStore } from "@/stores/workspace";

const extensions = [...defaultExtensions, slashCommand];

interface EditorProp {
	workspaceId: string;
	currentWorkspace: IUserWorkspace;
	initialValue?: string;
}
const AxonEditor = ({
	initialValue,
	currentWorkspace,
	workspaceId,
}: EditorProp) => {
	const [openNode, setOpenNode] = useState(false);
	const [openColor, setOpenColor] = useState(false);
	const [openLink, setOpenLink] = useState(false);

	const { updateWorkspaceContent, workspace } = useWorkspaceStore();

	const [_saveStatus, setSaveStatus] = useState<boolean>(false);

	const debouncedUpdates = useDebouncedCallback(
		async (editor: EditorInstance) => {
			setSaveStatus(false);
			const editorData = editor.getJSON();
			updateWorkspaceContent(
				workspaceId,
				currentWorkspace.workspace,
				editorData,
			);
			setSaveStatus(true);
		},
		500,
	);

	useEffect(() => {
		console.log(workspace);
	}, [workspace]);

	return (
		<div className="rounded-xl w-full flex items-center justify-center py-[20px] px-[50px]">
			<EditorRoot>
				<EditorContent
					immediatelyRender={false}
					//@ts-ignore
					initialContent={currentWorkspace.content}
					className={"w-full"}
					{...(initialValue && { initialContent: initialValue })}
					extensions={extensions}
					editorProps={{
						handleDOMEvents: {
							keydown: (_view, event) => handleCommandNavigation(event),
						},
						attributes: {
							class:
								"prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full",
						},
					}}
					onUpdate={({ editor }) => {
						debouncedUpdates(editor);
						setSaveStatus(false);
					}}
					slotAfter={<ImageResizer />}
				>
					<span />
					<EditorCommand className="z-50 bg-neutral-900/80 backdrop-blur-lg  h-auto max-h-[330px] overflow-y-auto rounded-md border-neutral-800 border-2 px-1 py-2  shadow-md transition-all">
						<EditorCommandEmpty className="px-2 text-muted-foreground">
							No results
						</EditorCommandEmpty>
						<EditorCommandList>
							{suggestionItems.map((item) =>
								item.title === "New page" ? (
									<EditorCommandItem
										value={item.title}
										onCommand={() => console.log("hello world")}
										className={
											"flex  w-full group items-center space-x-2 transition-all cursor-pointer rounded-md px-2 py-1 text-left text-sm hover:bg-neutral-800 aria-selected:bg-neutral-800"
										}
										key={item.title}
									>
										<div className="flex h-10 bg-customMain w-10 items-center justify-center  rounded-md border-2  border-neutral-700 border-muted bg-background">
											{item.icon}
										</div>
										<div>
											<p className="font-medium">{item.title}</p>
											<p className="text-xs text-muted-foreground">
												{item.description}
											</p>
										</div>
									</EditorCommandItem>
								) : (
									<EditorCommandItem
										value={item.title}
										onCommand={(val) => item.command?.(val)}
										className={
											"flex  w-full group items-center space-x-2 transition-all cursor-pointer rounded-md px-2 py-1 text-left text-sm hover:bg-neutral-800 aria-selected:bg-neutral-800"
										}
										key={item.title}
									>
										<div className="flex h-10 bg-customMain w-10 items-center justify-center  rounded-md border-2  border-neutral-700 border-muted bg-background">
											{item.icon}
										</div>
										<div>
											<p className="font-medium">{item.title}</p>
											<p className="text-xs text-muted-foreground">
												{item.description}
											</p>
										</div>
									</EditorCommandItem>
								),
							)}
						</EditorCommandList>
					</EditorCommand>

					<EditorBubble
						tippyOptions={{
							placement: "top",
						}}
						className="flex w-fit max-w-[90vw]  overflow-hidden rounded-md border-2 border-neutral-800 bg-neutral-900/50 backdrop-blur-lg shadow-xl"
					>
						<Separator orientation="vertical" />
						<NodeSelector open={openNode} onOpenChange={setOpenNode} />
						<Separator orientation="vertical" />
						<LinkSelector open={openLink} onOpenChange={setOpenLink} />
						<Separator orientation="vertical" />
						<TextButtons />
						<Separator orientation="vertical" />
						<ColorSelector
							open={openColor}
							onOpenChange={setOpenColor}
							setIsOpen={setOpenNode}
							isOpen={openNode}
						/>
					</EditorBubble>
				</EditorContent>
			</EditorRoot>
		</div>
	);
};

export default AxonEditor;
