"use client";

export function ReportButtons({ reportData }: { reportData: any }) {
	// Convert reportData → CSV
	const toCSV = (obj: any) => {
		const keys = Object.keys(obj);
		const values = Object.values(obj);

		return keys.join(",") + "\n" + values.join(",");
	};

	// Trigger download
	const downloadFile = (content: string, filename: string, type: string) => {
		const blob = new Blob([content], { type });
		const url = URL.createObjectURL(blob);

		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		a.click();

		URL.revokeObjectURL(url);
	};

	return (
		<div className="w-full h-fit flex flex-row items-center justify-center gap-6">
			{/* JSON DOWNLOAD */}
			<button
				onClick={() =>
					downloadFile(
						JSON.stringify(reportData, null, 2),
						`${reportData.product}-report.json`,
						"application/json",
					)
				}
				className="w-fit h-fit border-[3px] border-black shadow-button px-4 py-1 bg-[#a855f7]"
			>
				<p className="text-black text-sm font-medium">Download as JSON</p>
			</button>

			{/* CSV DOWNLOAD */}
			<button
				onClick={() =>
					downloadFile(
						toCSV(reportData),
						`${reportData.product}-report.csv`,
						"text/csv",
					)
				}
				className="w-fit h-fit border-[3px] border-black shadow-button px-4 py-1 bg-[#fb923c]"
			>
				<p className="text-black text-sm font-medium">Download as CSV</p>
			</button>
		</div>
	);
}
