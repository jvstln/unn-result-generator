import { z } from "zod";

const fileSchema = z
	.file()
	.max(5 * 1024 * 1024, "File size must be less than 5MB");

export const generateResultSchema = z.object({
	courseTitle: z.string().min(1, "Course title is required"),
	department: z.string().min(1, "Department is required"),
	courseCode: z.string().min(1, "Course code is required"),
	unitLoad: z
		.number()
		.min(1, "Unit must be at least 1")
		.max(10, "Unit cannot exceed 10"),
	session: z.string().min(1, "Session is required"),
	faculty: z.string().min(1, "Faculty is required"),
	semester: z.string().min(1, "Semester is required"),
	academicYear: z.string().min(1, "Academic year is required"),
	lecturerName: z.string().min(1, "Lecturer name is required"),
	hodName: z.string().min(1, "HOD name is required"),
	data: z.union([
		fileSchema,
		z
			.array(fileSchema, "Result sheet is required")
			.min(1)
			.transform((value) => value[0]),
	]),
	resultTemplate: z
		.union([
			fileSchema,
			z
				.array(fileSchema, "Result template is required")
				.min(1)
				.transform((value) => value[0]),
		])
		.optional(),

	config: z.object({
		recordsPerPage: z.number().min(1).default(30),
		defaultUndefinedValue: z.string(),
	}),
});
