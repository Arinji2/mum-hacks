"use client";

import { cn } from "@/lib/utils";
import { Check, Clock, Loader2 } from "lucide-react";

export function Item({
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
