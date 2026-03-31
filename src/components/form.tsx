import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { File as FileIcon, UploadCloud, X } from "lucide-react";
import { type ReactNode, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "#/lib/utils";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Kbd } from "./ui/kbd";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";

export const { fieldContext, formContext, useFieldContext } =
	createFormHookContexts();

export const { useAppForm } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {
		TextField,
		SelectField,
		FileInputField,
	},
	formComponents: {},
});

export type FieldProps = {
	label?: ReactNode;
	showName?: boolean;
	placeholder?: string;
	classNames?: Partial<
		Record<"container" | "label" | "input" | "error", string>
	>;
};

export type TextFieldProps = FieldProps & {
	type?: string;
};

export function TextField({
	label,
	showName,
	placeholder,
	type = "text",
	classNames,
}: TextFieldProps) {
	const field = useFieldContext<string | number>();

	return (
		<Field className={classNames?.container}>
			{label && (
				<FieldLabel
					htmlFor={field.name}
					className={cn("items-start", classNames?.label)}
				>
					{label}
					{showName && <Kbd>{field.name}</Kbd>}
				</FieldLabel>
			)}
			<Input
				id={field.name}
				type={type}
				value={field.state.value}
				onBlur={field.handleBlur}
				onChange={(e) =>
					field.handleChange(
						type === "number" && e.target.value
							? Number(e.target.value)
							: e.target.value,
					)
				}
				placeholder={placeholder}
				className={classNames?.input}
			/>
			<FieldError
				errors={field.state.meta.errors}
				className={classNames?.error}
			/>
		</Field>
	);
}

type SelectFieldProps = FieldProps & {
	options: { value: string; label: string }[];
};

export function SelectField({
	label,
	showName,
	placeholder,
	options,
	classNames,
}: SelectFieldProps) {
	const field = useFieldContext<string>();

	return (
		<Field className={classNames?.container}>
			{label && (
				<FieldLabel
					htmlFor={field.name}
					className={cn("items-start", classNames?.label)}
				>
					{label}
					{showName && <Kbd>{field.name}</Kbd>}
				</FieldLabel>
			)}
			<Select value={field.state.value} onValueChange={field.handleChange}>
				<SelectTrigger
					id={field.name}
					onBlur={field.handleBlur}
					className={classNames?.input}
				>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<FieldError
				errors={field.state.meta.errors}
				className={classNames?.error}
			/>
		</Field>
	);
}

export type FileInputFieldProps = FieldProps & {
	maxFiles?: number;
	maxSize?: number; // in bytes
	accept?: Record<string, string[]>; // e.g., { 'application/pdf': ['.pdf'] }
};

export function FileInputField({
	label,
	showName,
	placeholder,
	classNames,
	maxFiles = 1,
	maxSize,
	accept,
}: FileInputFieldProps) {
	// Let's assume the state holds an array of Files, or null
	const field = useFieldContext<File[] | null>();

	const multiple = maxFiles > 1;

	const handleDrop = useCallback(
		(acceptedFiles: File[]) => {
			const currentFiles = Array.isArray(field.state.value)
				? field.state.value
				: field.state.value
					? [field.state.value as unknown as File]
					: [];

			if (multiple) {
				const combined = [...currentFiles, ...acceptedFiles];
				field.handleChange(combined.slice(0, maxFiles));
			} else {
				field.handleChange([acceptedFiles[0]]);
			}
		},
		[field.handleChange, field.state.value, multiple, maxFiles],
	);

	const removeFile = (indexToRemove: number) => {
		const currentFiles = Array.isArray(field.state.value)
			? field.state.value
			: field.state.value
				? [field.state.value as unknown as File]
				: [];

		const updatedFiles = currentFiles.filter((_, i) => i !== indexToRemove);
		field.handleChange(updatedFiles.length > 0 ? updatedFiles : null);
	};

	const { getRootProps, getInputProps, isDragActive, isDragReject } =
		useDropzone({
			onDrop: handleDrop,
			maxFiles,
			maxSize,
			accept,
			multiple,
		});

	const files: File[] = Array.isArray(field.state.value)
		? field.state.value
		: field.state.value
			? [field.state.value as unknown as File]
			: [];

	return (
		<Field className={classNames?.container}>
			{label && (
				<FieldLabel
					htmlFor={field.name}
					className={cn("items-start", classNames?.label)}
				>
					{label}
					{showName && <Kbd>{field.name}</Kbd>}
				</FieldLabel>
			)}
			<div
				{...getRootProps()}
				className={cn(
					"mt-2 flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50",
					isDragActive
						? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
						: isDragReject
							? "border-red-500 bg-red-50/50 dark:bg-red-950/20"
							: "border-zinc-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50",
					classNames?.input,
				)}
			>
				<input {...getInputProps()} id={field.name} onBlur={field.handleBlur} />
				<UploadCloud
					className={cn(
						"mb-4 size-10 transition-colors",
						isDragActive
							? "text-blue-500"
							: isDragReject
								? "text-red-500"
								: "text-zinc-400 dark:text-zinc-500",
					)}
				/>
				<p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
					{isDragActive
						? "Drop the files here"
						: placeholder || "Drag & drop files here, or click to select"}
				</p>
				<p className="text-xs text-zinc-500 dark:text-zinc-400">
					{accept
						? `Supported: ${Object.values(accept).flat().join(", ")}`
						: "All files supported"}
					{maxSize && ` (Max: ${Math.round(maxSize / 1024 / 1024)}MB)`}
				</p>
			</div>

			{files.length > 0 && (
				<ul className="mt-4 flex flex-col gap-2">
					{files.map((file, i) => (
						<li
							// biome-ignore lint/suspicious/noArrayIndexKey: it's safe here
							key={`${file.name}-${i}`}
							className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950/50"
						>
							<div className="flex items-center gap-3 overflow-hidden">
								<FileIcon className="size-4 shrink-0 text-zinc-400 dark:text-zinc-500" />
								<span className="truncate font-medium text-zinc-700 dark:text-zinc-300">
									{file.name}
								</span>
								<span className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
									({Math.round(file.size / 1024)} KB)
								</span>
							</div>
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									removeFile(i);
								}}
								className="rounded-full p-1.5 text-zinc-400 opacity-70 transition-all hover:bg-red-50 hover:text-red-500 hover:opacity-100 dark:hover:bg-red-950/50"
							>
								<X className="size-4" />
								<span className="sr-only">Remove file</span>
							</button>
						</li>
					))}
				</ul>
			)}

			<FieldError
				errors={field.state.meta.errors}
				className={classNames?.error}
			/>
		</Field>
	);
}
