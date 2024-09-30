import { Check, ChevronDown } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { EditorBubbleItem, useEditor } from "novel";

import {
	PopoverTrigger,
	Popover,
	PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
export interface BubbleColorMenuItem {
	name: string;
	color: string;
}

interface ColorSelectorProps {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const TEXT_COLORS: BubbleColorMenuItem[] = [
	{
		name: "Default",
		color: "#ffffff",
	},
	{
		name: "Gray",
		color: "#9B9A97",
	},
	{
		name: "Brown",
		color: "#64473A",
	},
	{
		name: "Orange",
		color: "#D9730D",
	},
	{
		name: "Yellow",
		color: "#DFAB01",
	},
	{
		name: "Green",
		color: "#0F7B6C",
	},
	{
		name: "Blue",
		color: "#0B6E99",
	},
	{
		name: "Purple",
		color: "#6940A5",
	},
	{
		name: "Pink",
		color: "#AD1A72",
	},
	{
		name: "Red",
		color: "#E03E3E",
	},
];

const HIGHLIGHT_COLORS: BubbleColorMenuItem[] = [
	{
		name: "Default",
		color: "transparent", // No highlight
	},
	{
		name: "Gray",
		color: "#4B4B4B",
	},
	{
		name: "Brown",
		color: "#434040",
	},
	{
		name: "Orange",
		color: "#594A3A",
	},
	{
		name: "Yellow",
		color: "#59563B",
	},
	{
		name: "Green",
		color: "#354C4B",
	},
	{
		name: "Blue",
		color: "#364954",
	},
	{
		name: "Purple",
		color: "#443F57",
	},
	{
		name: "Pink",
		color: "#533B4C",
	},
	{
		name: "Red",
		color: "#594141",
	},
];
interface ColorSelectorProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
	open,
	onOpenChange,
}) => {
	const { editor } = useEditor();
	if (!editor) return null;

	const activeColorItem = TEXT_COLORS.find(({ color }) =>
		editor.isActive("textStyle", { color }),
	);

	const activeHighlightItem = HIGHLIGHT_COLORS.find(({ color }) =>
		editor.isActive("highlight", { color }),
	);

	return (
		<Popover modal={true} open={open} onOpenChange={onOpenChange}>
			<PopoverTrigger asChild>
				<Button
					className="gap-2 hover:text-white  hover:bg-neutral-800 rounded-none"
					variant="ghost"
				>
					<span
						className="rounded-sm px-1"
						style={{
							color: activeColorItem?.color,
							backgroundColor: activeHighlightItem?.color,
						}}
					>
						A
					</span>
					<ChevronDown className="h-4 w-4" />
				</Button>
			</PopoverTrigger>

			<PopoverContent
				sideOffset={5}
				className="my-1 flex max-h-80 w-48 flex-col overflow-hidden bg-neutral-900 text-white overflow-y-auto rounded border border-neutral-800 p-1 shadow-xl "
				align="start"
			>
				<div className="flex flex-col">
					<div className="my-1 px-2 text-sm font-semibold text-muted-foreground">
						Color
					</div>
					{TEXT_COLORS.map(({ name, color }, index) => (
						<EditorBubbleItem
							key={name}
							onSelect={() => {
								if (name === "Default") {
									editor.chain().focus().unsetColor().run();
								} else {
									editor.chain().focus().setColor(color).run();
								}
							}}
							className="flex cursor-pointer items-center justify-between px-2 py-1 text-sm rounded-md hover:bg-neutral-800"
						>
							<div className="flex items-center gap-2">
								<div
									className="rounded-sm border border-neutral-700 px-2 py-px font-medium"
									style={{ color }}
								>
									A
								</div>
								<span>{name}</span>
							</div>
						</EditorBubbleItem>
					))}
				</div>
				<div>
					<div className="my-1 px-2 text-sm font-semibold text-muted-foreground">
						Background
					</div>
					{HIGHLIGHT_COLORS.map(({ name, color }, index) => (
						<EditorBubbleItem
							key={name}
							onSelect={() => {
								if (name === "Default") {
									editor.chain().focus().unsetHighlight().run();
								} else {
									editor.chain().focus().setHighlight({ color }).run();
								}
							}}
							className="flex cursor-pointer items-center justify-between px-2 py-1 text-sm hover:bg-neutral-800 rounded-md"
						>
							<div className="flex items-center gap-2">
								<div
									className="rounded-sm border border-neutral-700 px-2 py-px font-medium"
									style={{ backgroundColor: color }}
								>
									A
								</div>
								<span>{name}</span>
							</div>
							{editor.isActive("highlight", { color }) && (
								<Check className="h-4 w-4" />
							)}
						</EditorBubbleItem>
					))}
				</div>
			</PopoverContent>
		</Popover>
	);
};
