import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import * as React from "react";
import { cn } from "#/lib/utils";
import { Spinner } from "./spinner";

const buttonVariants = cva(
	"inline-flex shrink-0 items-center justify-center gap-2 rounded-xl font-semibold whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
	{
		variants: {
			color: {
				primary:
					"bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 hover:scale-[1.02] active:scale-[0.98]",
				destructive:
					"bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/25 hover:from-red-700 hover:to-rose-700 hover:scale-[1.02] active:scale-[0.98]",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80",
				neutral:
					"bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700",
			},
			appearance: {
				solid: "",
				outline:
					"bg-transparent border shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
				ghost:
					"bg-transparent shadow-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
				link: "bg-transparent shadow-none underline-offset-4 hover:underline",
			},
			size: {
				xs: "h-7 gap-1 px-2.5 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
				sm: "h-8 gap-1.5 px-3 text-sm has-[>svg]:px-2.5",
				default: "h-9 px-4 py-2 text-sm has-[>svg]:px-3",
				lg: "h-12 px-10 text-base has-[>svg]:px-4",
				icon: "size-9",
				"icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
				"icon-sm": "size-8",
				"icon-lg": "size-10",
			},
		},
		compoundVariants: [
			// When using outline/ghost/link, strip solid-color backgrounds
			{
				appearance: "outline",
				color: "primary",
				className:
					"border-blue-300 text-blue-600 from-transparent to-transparent shadow-none hover:from-transparent hover:to-transparent dark:border-blue-700 dark:text-blue-400",
			},
			{
				appearance: "outline",
				color: "destructive",
				className:
					"border-red-300 text-red-600 from-transparent to-transparent shadow-none hover:from-transparent hover:to-transparent dark:border-red-700 dark:text-red-400",
			},
			{
				appearance: "ghost",
				color: "primary",
				className:
					"text-blue-600 from-transparent to-transparent shadow-none hover:from-transparent hover:to-transparent hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950",
			},
			{
				appearance: "ghost",
				color: "destructive",
				className:
					"text-red-600 from-transparent to-transparent shadow-none hover:from-transparent hover:to-transparent hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950",
			},
			{
				appearance: "link",
				color: "primary",
				className:
					"text-blue-600 from-transparent to-transparent shadow-none hover:from-transparent hover:to-transparent dark:text-blue-400",
			},
			{
				appearance: "link",
				color: "destructive",
				className:
					"text-red-600 from-transparent to-transparent shadow-none hover:from-transparent hover:to-transparent dark:text-red-400",
			},
		],
		defaultVariants: {
			color: "primary",
			appearance: "solid",
			size: "default",
		},
	},
);

function Button({
	className,
	color = "primary",
	appearance = "solid",
	size = "default",
	asChild = false,
	isLoading,
	loadingText,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
		isLoading?: boolean;
		loadingText?: string;
	}) {
	const Comp = asChild ? Slot.Root : "button";
	const LoadingComp = asChild ? "div" : React.Fragment;

	const children = isLoading ? (
		<LoadingComp>
			<Spinner />
			{loadingText}
		</LoadingComp>
	) : (
		props.children
	);

	return (
		<Comp
			data-slot="button"
			data-size={size}
			data-appearance={appearance}
			data-color={color}
			className={cn(buttonVariants({ appearance, color, size, className }))}
			{...props}
			disabled={isLoading || props.disabled}
		>
			{children}
		</Comp>
	);
}

export { Button, buttonVariants };
