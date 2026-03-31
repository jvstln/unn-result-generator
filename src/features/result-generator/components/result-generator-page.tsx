import { downloadFile } from "#/lib/utils";
import type { GenerateResult } from "../result-generator.type";
import {
	getTemplate,
	mapResultSheet,
	parseResultSheet,
	sectionalizeData,
} from "../result-generator.util";
import { ResultGeneratorForm } from "./result-generator-form";

export const ResultGeneratorPage = () => {
	const generateResult = async (data: GenerateResult) => {
		const parsedData = await parseResultSheet(data.data);
		const mappedData = mapResultSheet(parsedData);

		const { doc } = await getTemplate({
			template: data.resultTemplate,
			docxtemplaterOptions: {
				nullGetter: () => data.config.defaultUndefinedValue,
			},
		});

		doc.render({
			pages: sectionalizeData(mappedData, data.config.recordsPerPage).map(
				(page) => ({
					...data,
					...page,
				}),
			),
		});

		const blob = doc.getZip().generate({
			type: "blob",
			mimeType:
				"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		});

		downloadFile(blob, "result.docx");
	};

	return (
		<div>
			<ResultGeneratorForm onSubmit={generateResult} />
		</div>
	);
};
