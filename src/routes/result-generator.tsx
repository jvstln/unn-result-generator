import { createFileRoute } from "@tanstack/react-router";
import { ResultGeneratorPage } from "#/features/result-generator/components/result-generator-page";

export const Route = createFileRoute("/result-generator")({
	component: RouteComponent,
});

function RouteComponent() {
	return <ResultGeneratorPage />;
}
