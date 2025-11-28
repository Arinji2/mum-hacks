import { cn } from "@/lib/utils";
import { ArrowLeft, Check, Clock, Loader2 } from "lucide-react";
import Link from "next/link";

export default async function Analysis() {
	return (
		<div className="w-full h-screen flex flex-col items-center justify-start gap-10 py-10">
			<p className="text-lg font-medium tracking-wider text-offwhite">
				ANALYZING: IPHONE X
			</p>
			<h1 className="text-7xl font-bold tracking-tighter ">
				Analyzing <br /> Sentiment
			</h1>
			<div className="w-full px-2 md:w-[70%] h-fit flex flex-col items-center justify-center gap-5">
				<Item status="complete" text="Verifying Product" color="#4ade80" />
				<Item
					status="in-progress"
					text="Fetching Statements from the Internet"
					color="#facc15"
				/>

				<Item status="queued" text="Analyzing Statements" color="#ec4899" />

				<Item status="queued" text="Reasoning on Sentiments" color="#a855f7" />

				<Item status="queued" text="Finishing up on Analysis" color="#fb923c" />
			</div>

			<Link
				href="/"
				className=" gap-2 flex flex-row items-center justify-center text-offwhite text-lg font-semibold"
			>
				<ArrowLeft className="text-offwhite text-lg font-semibold" />
				Back to Home
			</Link>
		</div>
	);
}

function Item({
	status,
	text,
	color,
}: {
	status: "complete" | "in-progress" | "queued";
	text: string;
	color: string;
}) {
	return (
		<div
			className={cn(
				"w-full md:flex-row flex-col items-start border-[3px] border-black shadow-button flex p-5 md:items-center justify-between h-fit bg-[--color]",
				{
					"bg-white": status === "queued",
				},
			)}
			style={{ "--color": color } as React.CSSProperties}
		>
			<div className="w-fit h-full flex flex-row items-center justify-center gap-3">
				<div
					className={cn(
						"size-8 text-5xl text-black bg-white flex items-center justify-center border-[2px] border-black",
						{
							"opacity-50": status === "queued",
						},
					)}
				>
					{status === "complete" ? (
						<Check />
					) : status === "in-progress" ? (
						<Loader2 className="animate-spin " />
					) : (
						<Clock />
					)}
				</div>
				<p
					className={cn("text-black font-semibold text-lg", {
						"opacity-50": status === "queued",
					})}
				>
					{text}
				</p>
			</div>
			<p
				className={cn("text-black font-semibold text-lg", {
					"opacity-50": status === "queued",
				})}
			>
				{status === "complete"
					? "COMPLETE"
					: status === "in-progress"
						? "IN PROGRESS..."
						: "PENDING"}
			</p>
		</div>
	);
}
