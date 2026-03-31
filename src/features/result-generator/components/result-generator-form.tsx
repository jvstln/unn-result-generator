import { FileTextIcon, Info } from "lucide-react";
import { useState } from "react";
import { useAppForm } from "../../../components/form";
import { Button } from "../../../components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "../../../components/ui/tooltip";
import { generateResultSchema } from "../result-generator.schema";
import type {
	GenerateResult,
	GenerateResultInput,
} from "../result-generator.type";
import { ResultSheetGuideDialog } from "./result-sheet-guide-dialog";

type ResultGeneratorFormProps = {
	onSubmit?: (data: GenerateResult) => void;
};

export const ResultGeneratorForm = ({ onSubmit }: ResultGeneratorFormProps) => {
	const [showResultSheetGuide, setShowResultSheetGuide] = useState(false);
	const [persistedData] = useState<GenerateResultInput | null>(() => {
		const data = localStorage.getItem("resultGenerator");
		if (!data) return null;
		return JSON.parse(data);
	});

	const form = useAppForm({
		defaultValues: {
			courseTitle: "Introduction to Computer Science",
			department: "Computer Science",
			courseCode: "CSC 101",
			unitLoad: 3,
			session: "2023/2024",
			faculty: "Physical Sciences",
			semester: "First Semester",
			academicYear: "Year 1",
			lecturerName: "Prof. John Doe",
			hodName: "Prof. John Doe",
			data: undefined as unknown as GenerateResultInput["data"],
			resultTemplate: undefined,

			config: { recordsPerPage: 30, defaultUndefinedValue: "None" },
			...persistedData,
		} satisfies GenerateResultInput as GenerateResultInput,
		validators: {
			onChangeAsync: generateResultSchema,
		},
		listeners: {
			onChange: ({ formApi }) => {
				// Persist changes to localStorage
				localStorage.setItem(
					"resultGenerator",
					JSON.stringify({
						...formApi.state.values,
						data: undefined,
						resultTemplate: undefined,
					}),
				);
			},
		},
		onSubmit: async ({ value }) => {
			const parsedValue = await generateResultSchema.parseAsync(value);
			onSubmit?.(parsedValue);
		},
	});

	return (
		<div className="w-full max-w-5xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
			<div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-2xl border border-white/20 dark:border-zinc-800 transition-all hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]">
				<div className="mb-10 text-center md:text-left">
					<div className="inline-block p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl mb-4">
						<FileTextIcon className="size-10" />
					</div>
					<h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-2">
						Generate Result
					</h2>
					<p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-2xl">
						Enter the details below to accurately process and format standard
						course and faculty information for the generated result block.
					</p>
				</div>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="space-y-8"
				>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
						<form.AppField name="courseTitle">
							{(field) => (
								<field.TextField
									label="Course Title"
									showName
									placeholder="e.g. Introduction to Physics"
								/>
							)}
						</form.AppField>
						<form.AppField name="courseCode">
							{(field) => (
								<field.TextField
									label="Course Code"
									showName
									placeholder="e.g. PHY 101"
								/>
							)}
						</form.AppField>
						<form.AppField name="unitLoad">
							{(field) => (
								<field.TextField
									label="Credit Units"
									showName
									type="number"
									placeholder="e.g. 3"
								/>
							)}
						</form.AppField>
						<form.AppField name="department">
							{(field) => (
								<field.TextField
									label="Department"
									showName
									placeholder="e.g. Physics and Astronomy"
								/>
							)}
						</form.AppField>
						<form.AppField name="faculty">
							{(field) => (
								<field.TextField
									label="Faculty"
									showName
									placeholder="e.g. Physical Sciences"
								/>
							)}
						</form.AppField>
						<form.AppField name="session">
							{(field) => (
								<field.TextField
									label="Session"
									showName
									placeholder="e.g. 2023/2024"
								/>
							)}
						</form.AppField>
						<form.AppField name="semester">
							{(field) => (
								<field.SelectField
									label="Semester"
									showName
									placeholder="Select semester..."
									options={[
										{ value: "First Semester", label: "First Semester" },
										{ value: "Second Semester", label: "Second Semester" },
									]}
								/>
							)}
						</form.AppField>
						<form.AppField name="academicYear">
							{(field) => (
								<field.TextField
									label="Academic Year"
									showName
									placeholder="e.g. Year 1"
								/>
							)}
						</form.AppField>
						<form.AppField name="lecturerName">
							{(field) => (
								<field.TextField
									label="Lecturer Name"
									showName
									placeholder="e.g. Prof. John Doe"
								/>
							)}
						</form.AppField>
						<form.AppField name="hodName">
							{(field) => (
								<field.TextField
									label="HOD Name"
									showName
									placeholder="e.g. Prof. John Doe"
								/>
							)}
						</form.AppField>
					</div>

					<hr className="border-dashed" />

					<div className="flex flex-wrap *:flex-1 gap-4">
						<form.AppField name="data">
							{(field) => (
								<field.FileInputField
									label={
										<div className="flex flex-col items-start gap-1.5">
											Result Sheet (CSV, Excel)
											<button
												type="button"
												onClick={() => setShowResultSheetGuide(true)}
												className="link"
											>
												Click here for result sheet guide
											</button>
										</div>
									}
									showName
									accept={{
										"text/csv": [".csv"],
										"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
											[".xlsx"],
										"application/vnd.ms-excel": [".xls"],
									}}
								/>
							)}
						</form.AppField>

						<form.AppField name="resultTemplate">
							{(field) => (
								<field.FileInputField
									label={
										<div className="flex flex-col items-start gap-1.5">
											Result Template (Optional Word Document)
											<div className="flex items-center gap-1.5">
												<a
													download="template.docx"
													href="/template.docx"
													className="link"
												>
													Click here to download default template
												</a>
												<Tooltip>
													<TooltipTrigger asChild>
														<button
															type="button"
															className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
														>
															<Info className="size-4" />
														</button>
													</TooltipTrigger>
													<TooltipContent>
														<a
															href="https://docxtemplater.com/docs/api"
															target="_blank"
															rel="noreferrer"
															className="underline decoration-dotted"
														>
															Click here to read docxtemplater docs
														</a>{" "}
														to learn how to customize the template
													</TooltipContent>
												</Tooltip>
											</div>
										</div>
									}
									showName
									accept={{
										"application/vnd.openxmlformats-officedocument.wordprocessingml.document":
											[".docx"],
									}}
								/>
							)}
						</form.AppField>
					</div>

					<hr className="border-dashed" />

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
						<form.AppField name="config.recordsPerPage">
							{(field) => (
								<field.TextField label="Records/Rows per Page" type="number" />
							)}
						</form.AppField>
						<form.AppField name="config.defaultUndefinedValue">
							{(field) => <field.TextField label="Default Undefined Value" />}
						</form.AppField>
					</div>

					<div className="pt-8 flex justify-end items-center border-t border-zinc-100 dark:border-zinc-800">
						<form.Subscribe selector={(state) => [state.isSubmitting]}>
							{([isSubmitting]) => (
								<Button
									type="submit"
									color="primary"
									size="lg"
									className="w-full md:w-auto"
									isLoading={isSubmitting}
								>
									Generate result
								</Button>
							)}
						</form.Subscribe>
					</div>
				</form>
			</div>
			<ResultSheetGuideDialog
				open={showResultSheetGuide}
				onOpenChange={setShowResultSheetGuide}
			/>
		</div>
	);
};
