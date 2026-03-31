import { createFileRoute } from "@tanstack/react-router";
import { ResultGeneratorForm } from "#/features/result-generator/components/result-generator-form";

export const Route = createFileRoute("/")({ component: App });

async function App() {
	return (
		<main>
			<ResultGeneratorForm />
		</main>
	);
}
