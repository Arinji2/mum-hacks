"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Item } from "./task-item";
import { PageClient } from "./page.client";
import { useSearchParams } from "next/navigation";

export function PageProgress() {
	const searchParams = useSearchParams();
	const productName = searchParams.get("productName");
	const tasks = [
		{ text: "Verifying Product", color: "#4ade80" },
		{ text: "Fetching Statements from the Internet", color: "#facc15" },
		{ text: "Analyzing Statements", color: "#ec4899" },
		{ text: "Reasoning on Sentiments", color: "#a855f7" },
		{ text: "Finishing up on Analysis", color: "#fb923c" },
	];

	const [activeIndex, setActiveIndex] = useState(0);

	useEffect(() => {
		if (activeIndex >= tasks.length - 1) return;

		const timer = setTimeout(() => {
			setActiveIndex((prev) => prev + 1);
		}, 1000);

		return () => clearTimeout(timer);
	}, [activeIndex]);

	return (
		<div className="w-full h-screen flex flex-col items-center justify-start gap-10 py-10">
			<p className="text-lg font-medium tracking-wider text-offwhite">
				ANALYZING: {productName?.toUpperCase()}
			</p>

			<h1 className="text-7xl font-bold tracking-tighter">
				Analyzing <br /> Sentiment
			</h1>

			<div className="w-full px-2 md:w-[70%] h-fit flex flex-col items-center justify-center gap-5">
				{tasks.map((task, i) => {
					let status: "complete" | "in-progress" | "queued" = "queued";

					if (i < activeIndex) status = "complete";
					else if (i === activeIndex) status = "in-progress";

					return (
						<Item key={i} status={status} text={task.text} color={task.color} />
					);
				})}
			</div>

			<Link
				href="/"
				className=" gap-2 flex flex-row items-center justify-center text-offwhite text-lg font-semibold"
			>
				<ArrowLeft className="text-offwhite text-lg font-semibold" />
				Back to Home
			</Link>

			<PageClient />
		</div>
	);
}
