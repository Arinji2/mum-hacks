import { colors } from "@/colors";
import { getAuthPB } from "@/lib/pocketbase";
import { ReportButtons } from "./report";
import Link from "next/link";

export type ProductAnalysis = {
	created: string;
	distribution_negative: number;
	distribution_neutral: number;
	distribution_positive: number;
	id: string;
	indexed_on: string;
	inventory: boolean;
	overall_sentiment: string;
	product: string;
	reasoning_summary: string;
	scores_negative: number;
	scores_neutral: number;
	scores_positive: number;
	source: string;
	updated: string;
};

export default async function Report({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const pb = await getAuthPB();

	const reportData: ProductAnalysis = await pb
		.collection("products")
		.getOne(id);

	const isPositive = reportData.overall_sentiment === "Positive";

	const totalDistribution =
		reportData.distribution_negative +
			reportData.distribution_neutral +
			reportData.distribution_positive || 1;

	const pctPositive =
		(reportData.distribution_positive / totalDistribution) * 100;
	const pctNegative =
		(reportData.distribution_negative / totalDistribution) * 100;

	const chosenDistributionPct = isPositive ? pctPositive : pctNegative;

	const normalized = Math.round(chosenDistributionPct * 100) / 100; // nice % for bar

	const chosenScoreFraction = isPositive
		? reportData.scores_positive
		: reportData.scores_negative;

	const reportScore = Math.round(chosenScoreFraction * 100);
	const maxScore = 100;

	const fillColor =
		reportData.overall_sentiment === "Positive"
			? colors.sentiments.positive
			: reportData.overall_sentiment === "Negative"
				? colors.sentiments.negative
				: colors.sentiments.neutral;

	const sentimentLabel = isPositive
		? reportScore >= 60
			? "POSITIVE"
			: reportScore >= 40
				? "NEUTRAL"
				: "NEGATIVE"
		: reportScore >= 60
			? "NEGATIVE"
			: reportScore >= 40
				? "NEUTRAL"
				: "POSITIVE";

	return (
		<div className="w-full h-screen flex flex-col items-center justify-start py-8 gap-6 px-6">
			<div className="w-full h-fit flex flex-col gap-2 md:flex-row items-start justify-between">
				<div className="w-fit h-fit flex flex-col items-start justify-start">
					<h1 className="text-3xl font-bold tracking-tighter">
						Sentiment Analysis Report
					</h1>
					<h2 className="text-xl text-black font-medium">
						{reportData.product}
					</h2>
					<h3 className="text-slate-600 text-xl">{reportData.source}</h3>
				</div>

				<div className="w-fit shadow-button h-fit p-1 px-3 border-[3px] border-black">
					<p className="text-lg font-medium">
						REPORT DATE: {new Date(reportData.indexed_on).toLocaleDateString()}
					</p>
				</div>
			</div>

			<div
				style={{ "--color": fillColor } as React.CSSProperties}
				className="w-full h-fit border-[3px] p-3 border-black shadow-button flex flex-col md:items-start items-center justify-start"
			>
				<h4 className="text-lg tracking-wider font-medium">
					OVERALL SENTIMENT SCORE
				</h4>

				<div className="w-full h-fit flex flex-col md:flex-row items-center justify-center gap-4">
					<p className="text-5xl md:text-7xl font-bold text-black">
						{reportScore}
						<span className="text-slate-700 text-3xl">/{maxScore}</span>
					</p>

					<div className="w-fit h-fit flex flex-col items-stretch justify-center gap-2">
						<div className="relative w-[200px] h-[45px] border-[3px] border-black overflow-hidden">
							<div
								className="bg-[--color] h-full"
								style={{ width: `${normalized}%` }}
							/>
						</div>

						<div className="w-auto bg-[--color] h-fit p-1 px-4 flex items-center justify-center border-[3px] border-black shadow-button">
							<p className="text-lg text-black font-medium">{sentimentLabel}</p>
						</div>
					</div>
				</div>
			</div>

			<div
				style={{ "--color": fillColor } as React.CSSProperties}
				className="w-full h-fit border-[3px] p-3 border-black shadow-button flex flex-col items-start justify-start"
			>
				<h4 className="text-lg tracking-wider font-medium">
					SENTIMENT SUMMARY
				</h4>

				<p className="text-lg font-medium text-offwhite">
					{reportData.reasoning_summary}
				</p>
			</div>

			<div className="w-full h-fit flex flex-row items-center justify-center gap-6">
				<ReportButtons reportData={reportData} />
			</div>

			<Link
				href="/"
				className="w-fit h-fit flex flex-row items-center justify-center gap-2 text-offwhite text-lg font-semibold"
			>
				{" "}
				Back to Dashboard
			</Link>
		</div>
	);
}
