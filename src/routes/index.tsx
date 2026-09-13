import { createFileRoute } from "@tanstack/react-router";
import { ResultGeneratorPage } from "#/features/result-generator/components/result-generator-page";

const SITE_URL = "https://unn-result-generator.vercel.app";

export const Route = createFileRoute("/")({
	head: () => ({
		meta: [
			{ title: "UNN Result Generator — Free University Result Sheet Tool" },
			{
				name: "description",
				content:
					"Generate professional university result sheets from CSV or Excel files. Auto-calculate grades, sectionalise pages, and download formatted DOCX documents instantly.",
			},
			{ property: "og:url", content: SITE_URL },
			{ property: "og:title", content: "UNN Result Generator" },
			{
				property: "og:description",
				content:
					"Generate professional university result sheets from CSV or Excel files. Free, fast, and works offline.",
			},
			{ name: "twitter:title", content: "UNN Result Generator" },
			{
				name: "twitter:description",
				content:
					"Generate professional university result sheets from CSV or Excel files. Free, fast, and works offline.",
			},
		],
		links: [{ rel: "canonical", href: SITE_URL }],
	}),
	component: App,
});

function App() {
	return (
		<main>
			<ResultGeneratorPage />
		</main>
	);
}
