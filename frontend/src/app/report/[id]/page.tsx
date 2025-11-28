import { colors } from "@/colors";

export default async function Report({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const reportScore = 2.8;
	const maxScore = 10;
	const normalized = (reportScore / maxScore) * 100;

	const getColor = (score: number) => {
		if (score < 4) return colors.sentiments.negative;
		if (score < 6) return colors.sentiments.neutral;
		return colors.sentiments.positive;
	};

	const fillColor = getColor(reportScore);

	return (
		<div className="w-full h-fit flex flex-col items-center justify-start py-8 gap-6 px-6">
			{" "}
			<div className="w-full h-fit flex flex-row items-start justify-between">
				{" "}
				<div className="w-fit h-fit flex flex-col items-start justify-start">
					{" "}
					<h1 className="text-3xl font-bold tracking-tighter">
						{" "}
						Sentiment Analysis Report{" "}
					</h1>{" "}
					<h2 className="text-xl text-black font-medium">Iphone X</h2>{" "}
					<h3 className="text-slate-600 text-xl">by Apple</h3>{" "}
				</div>{" "}
				<div className="w-fit shadow-button h-fit p-1 px-3 border-[3px] border-black">
					{" "}
					<p className="text-lg font-medium">
						REPORT DATE: OCTOBER 27, 2025
					</p>{" "}
				</div>{" "}
			</div>
			<div
				style={
					{
						"--color": fillColor,
					} as React.CSSProperties
				}
				className="w-full h-fit border-[3px] p-3 border-black shadow-button flex flex-col items-start justify-start "
			>
				<h4 className="text-lg tracking-wider font-medium">
					OVERALL SENTIMENT SCORE
				</h4>

				<div className="w-full h-fit flex flex-row items-center justify-center gap-4">
					<p className="text-7xl font-bold text-black">
						{reportScore}
						<span className="text-slate-700 text-3xl">/10</span>
					</p>

					<div className="w-fit h-fit flex flex-col items-stretch justify-center gap-2">
						<div className="relative w-[200px] h-[45px] border-[3px] border-black overflow-hidden">
							<div
								className={`bg-[--color] h-full`}
								style={{ width: `${normalized}%` }}
							/>
						</div>

						<div className="w-auto bg-[--color] h-fit p-1 px-4 flex  items-center justify-center border-[3px] border-black shadow-button">
							<p className="text-lg text-black font-medium">
								{reportScore >= 8
									? "POSITIVE"
									: reportScore < 8 && reportScore > 4
										? "NEUTRAL"
										: "NEGATIVE"}
							</p>
						</div>
					</div>
				</div>
			</div>
			<div
				style={
					{
						"--color": fillColor,
					} as React.CSSProperties
				}
				className="w-full h-fit border-[3px] p-3 border-black shadow-button flex flex-col items-start justify-start "
			>
				<h4 className="text-lg tracking-wider font-medium">
					SENTIMENT SUMMARY
				</h4>

				<p className="text-lg font-medium text-offwhite">
					This is a test review, the product is very good and I would use it
					multiple times on a daily basis
				</p>
			</div>
			<div className="w-full h-fit flex xl:grid-cols-3 gap-3 md:grid-cols-2 grid-cols-1">
				<div className="w-full h-fit flex border-black border-[3px] shadow-button flex-col items-start justify-center p-3 gap-2">
					<p className="text-2xl font-semibold">REDDIT</p>
					<Card content="This is a test review, the product is very good and I would use it multiple times on a daily basis" />

					<Card content="This is a test review, the product is very good and I would use it multiple times on a daily basis" />
				</div>
				<div className="w-full h-fit flex border-black border-[3px] shadow-button flex-col items-start justify-center p-3 gap-2">
					<p className="text-2xl font-semibold">X</p>
					<Card content="This is a test review, the product is very good and I would use it multiple times on a daily basis" />

					<Card content="This is a test review, the product is very good and I would use it multiple times on a daily basis" />
				</div>
				<div className="w-full h-fit flex border-black border-[3px] shadow-button flex-col items-start justify-center p-3 gap-2">
					<p className="text-2xl font-semibold">QUORA</p>
					<Card content="This is a test review, the product is very good and I would use it multiple times on a daily basis" />

					<Card content="This is a test review, the product is very good and I would use it multiple times on a daily basis" />
				</div>
			</div>
			<div className="w-full h-fit flex flex-row items-center justify-center gap-6">
				<div className="w-fit h-fit border-[3px] border-black shadow-button px-4 py-1 bg-[#a855f7]">
					<p className="text-black text-sm font-medium">Download as JSON</p>
				</div>
				<div className="w-fit h-fit border-[3px] border-black shadow-button px-4 py-1 bg-[#fb923c]">
					<p className="text-black text-sm font-medium">Download as CSV</p>
				</div>
			</div>
		</div>
	);
}

function Card({ content }: { content: string }) {
	return (
		<div className=" p-2 w-full h-fit flex flex-col items-start justify-start gap-2 border-[2px] border-black">
			<p className="text-sm font-medium text-black">{content}</p>
		</div>
	);
}
