import Docxtemplater from "docxtemplater";
import expressionParser from "docxtemplater/expressions";
import Papa from "papaparse";
import PizZip from "pizzip";
import { readSheet } from "read-excel-file/browser";
import type { ResultRecord } from "./result-generator.type";

/**
 * Parses a given result sheet (CSV or Excel) and returns an array of objects
 * where each record maps header column names to their row values.
 *
 * @param file - The uploaded File object
 * @returns A promise resolving to an array of parsed records
 */
export const parseResultSheet = async (
	file: File,
): Promise<Array<Record<string, string>>> => {
	const isExcel =
		file.type.includes("excel") ||
		file.type.includes("spreadsheetml") ||
		file.name.endsWith(".xlsx") ||
		file.name.endsWith(".xls");

	if (isExcel) {
		try {
			const rows = await readSheet(file);
			if (!rows || rows.length === 0) return [];

			// Assume first row contains headers
			const headers = (rows[0] as unknown[]).map((h) => String(h ?? "").trim());
			const results: Array<Record<string, string>> = [];

			for (let i = 1; i < rows.length; i++) {
				const row = rows[i] as unknown[];
				const record: Record<string, string> = {};

				headers.forEach((header, index) => {
					if (header) {
						record[header] =
							row[index] !== null && row[index] !== undefined
								? String(row[index]).trim()
								: "";
					}
				});

				results.push(record);
			}

			return results;
		} catch (_error) {
			throw new Error(
				"Failed to parse the Excel file. Please ensure it is a valid .xlsx file.",
			);
		}
	} else {
		// Parse CSV
		return new Promise((resolve, reject) => {
			Papa.parse(file, {
				header: true,
				skipEmptyLines: true,
				complete: (results: unknown) => {
					const { data } = results as { data: Array<Record<string, string>> };
					resolve(data);
				},
				error: (error: unknown) => {
					reject(
						new Error(`Failed to parse CSV file: ${(error as Error).message}`),
					);
				},
			});
		});
	}
};

/**
 * A map of possible columns in the result sheet. Attempts to predefined find columns
 * that match the regex patterns for easy calculations and auto population of fields.
 */
const resultSheetTemplateMap = {
	name: [/^name/i],
	regNo: [/^regNo$/i, /^matric/i],
	examScore: [/^examScore$/i, /^exam/i],
	caScore: [/^caScore$/i, /^ca/i, /^cont. assess/i],
	totalScore: [/^totalScore$/i, /^total$/i],
	grade: [/^grade$/i],
	department: [/^department$/i, /^dept$/i],
} as const satisfies Record<string, Array<string | RegExp>>;

/**
 * Finds the column name from resultSheetTemplateMap in the result sheet that matches the given string.
 * @param string - The string to match
 * @returns The column name if found, otherwise undefined
 */
const findColumn = (string: string) => {
	for (const [column, patterns] of Object.entries(resultSheetTemplateMap)) {
		if (patterns.some((pattern) => pattern.test(string))) {
			return column;
		}
	}
};

export const mapResultSheet = (data: ResultRecord[]) => {
	return data.map((record) => {
		const mappedRecord: ResultRecord = { ...record };

		for (const key in record) {
			const column = findColumn(key);
			mappedRecord[column || key] = record[key];
		}

		// Calculate and populate missing values like grade and totalScore
		const isNullish = (value: unknown) =>
			value === undefined || value === null || Number.isNaN(value);

		mappedRecord.totalScore = Math.round(Number(mappedRecord.totalScore));
		mappedRecord.caScore = Math.round(Number(mappedRecord.caScore));
		mappedRecord.examScore = Math.round(Number(mappedRecord.examScore));

		if (
			isNullish(mappedRecord.totalScore) &&
			!isNullish(mappedRecord.caScore) &&
			!isNullish(mappedRecord.examScore)
		) {
			mappedRecord.totalScore = Math.round(
				Number(mappedRecord.caScore) + Number(mappedRecord.examScore),
			);
		}

		if (isNullish(mappedRecord.grade)) {
			mappedRecord.grade = calculateGrade(Number(mappedRecord.totalScore));
		}

		return mappedRecord;
	});
};

const calculateGrade = (totalScore: number) => {
	if (totalScore >= 70) return "A";
	if (totalScore >= 60) return "B";
	if (totalScore >= 50) return "C";
	if (totalScore >= 45) return "D";
	if (totalScore >= 40) return "E";
	return "F";
};

export const sectionalizeData = <T extends ResultRecord>(
	data: T[],
	count = 30,
) => {
	const sections: Array<{ data: T[]; summary: Record<string, unknown> }> = [];

	data.forEach((d) => {
		let lastSection = sections[sections.length - 1];
		if (!lastSection || lastSection.data.length === count) {
			sections.push({
				summary: {
					totalA: 0,
					totalB: 0,
					totalC: 0,
					totalD: 0,
					totalE: 0,
					totalF: 0,
				},
				data: [],
			});
			lastSection = sections[sections.length - 1];
		}

		lastSection.data.push({ ...d, sn: lastSection.data.length + 1 });
		lastSection.summary[`total${d.grade}`] =
			(Number(lastSection.summary[`total${d.grade}`]) || 0) + 1;
	});

	return sections;
};

const parser = expressionParser.configure({
	filters: {}, // optional: define your custom filters here
});
export const getTemplate = async ({
	template,
	docxtemplaterOptions,
}: {
	template?: File;
	docxtemplaterOptions?: Docxtemplater.DXT.ConstructorOptions;
}) => {
	let templateAsArrayBuffer: ArrayBuffer;
	if (template) {
		templateAsArrayBuffer = await template.arrayBuffer();
	} else {
		templateAsArrayBuffer = await fetch("/template.docx").then((res) =>
			res.arrayBuffer(),
		);
	}
	const templateAsZip = new PizZip(templateAsArrayBuffer);
	const doc = new Docxtemplater(templateAsZip, {
		parser,
		paragraphLoop: true,
		linebreaks: true,
		...docxtemplaterOptions,
	});

	return { doc, templateAsZip, templateAsArrayBuffer };
};
