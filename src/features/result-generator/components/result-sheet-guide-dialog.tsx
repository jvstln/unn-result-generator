import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "#/components/ui/dialog";

export const ResultSheetGuideDialog = ({
	children,
	...props
}: React.ComponentProps<typeof Dialog>) => {
	return (
		<Dialog {...props}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>Result Sheet Format Guide</DialogTitle>
					<DialogDescription>
						Please ensure your uploaded result sheet follows the standard format
						for accurate processing.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 text-sm text-zinc-700 dark:text-zinc-300">
					<p>
						Your <strong>CSV or Excel (.xlsx, .xls)</strong> file should contain
						the following columns (exact order is recommended, but
						case-insensitive column headers are matched where possible):
					</p>
					<div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-x-auto">
						<table className="w-full text-left border-collapse min-w-[500px]">
							<thead>
								<tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
									<th className="p-3 font-semibold whitespace-nowrap">S/N</th>
									<th className="p-3 font-semibold whitespace-nowrap">
										Reg No
									</th>
									<th className="p-3 font-semibold whitespace-nowrap">Name</th>
									<th className="p-3 font-semibold whitespace-nowrap">CA</th>
									<th className="p-3 font-semibold whitespace-nowrap">Exam</th>
									<th className="p-3 font-semibold whitespace-nowrap">Total</th>
									<th className="p-3 font-semibold whitespace-nowrap">Grade</th>
								</tr>
							</thead>
							<tbody>
								<tr className="border-b border-zinc-200 dark:border-zinc-800">
									<td className="p-3">1</td>
									<td className="p-3">2020/123456</td>
									<td className="p-3">John Doe</td>
									<td className="p-3">25</td>
									<td className="p-3">50</td>
									<td className="p-3">75</td>
									<td className="p-3">A</td>
								</tr>
								<tr>
									<td className="p-3">2</td>
									<td className="p-3">2020/654321</td>
									<td className="p-3">Jane Smith</td>
									<td className="p-3">20</td>
									<td className="p-3">45</td>
									<td className="p-3">65</td>
									<td className="p-3">B</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div className="pt-2 space-y-2 border-t border-zinc-100 dark:border-zinc-800">
						<h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
							Supported Formats
						</h4>
						<p className="text-zinc-500 dark:text-zinc-400">
							Both CSV and Excel (.xlsx, .xls) files are fully supported.
						</p>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
