import { createFileRoute } from "@tanstack/react-router";
import { ResultGeneratorPage } from "#/features/result-generator/components/result-generator-page";

const SITE_URL = "https://unn-result-generator.vercel.app";

export const Route = createFileRoute("/result-generator")({
	head: () => ({
		meta: [
			{
				title: "Generate Result — UNN Result Generator",
			},
			{
				name: "description",
				content:
					"Upload your result sheet and DOCX template to generate a formatted university result document. Supports CSV and Excel input.",
			},
			{ property: "og:url", content: `${SITE_URL}/result-generator` },
			{ property: "og:title", content: "Generate Result — UNN Result Generator" },
			{
				property: "og:description",
				content:
					"Upload your result sheet and DOCX template to generate a formatted university result document.",
			},
			{ name: "twitter:title", content: "Generate Result — UNN Result Generator" },
			{
				name: "twitter:description",
				content:
					"Upload your result sheet and DOCX template to generate a formatted university result document.",
			},
		],
		links: [{ rel: "canonical", href: `${SITE_URL}/result-generator` }],
	}),
	component: RouteComponent,
});

function RouteComponent() {
	return <ResultGeneratorPage />;
}
