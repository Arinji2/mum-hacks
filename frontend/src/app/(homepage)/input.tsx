"use client";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function Input() {
	const searchParams = useSearchParams();
	const params = new URLSearchParams(searchParams);
	const router = useRouter();
	const pathname = usePathname();
	const [_, startTransition] = useTransition();
	return (
		<form className="w-full flex flex-row items-stretch justify-start gap-3">
			<div className="w-full p-3  border-[3px] border-black  h-fit flex flex-row items-center justify-start gap-2">
				<Search className="text-slate-600 text-lg" />
				<input
					type="text"
					className=" w-full  outline-none text-black text-lg"
					placeholder="Search Products..."
					onChange={(e) => {
						const value = e.target.value;
						if (value.trim() === "") {
							params.delete("search");
						} else {
							params.set("search", value);
						}
						window.history.pushState(
							null,
							"",
							`?${params.toString().toLowerCase()}`,
						);
					}}
				/>
			</div>
			<button
				type="submit"
				onClick={(e) => {
					startTransition(() => {
						router.replace(`${pathname}?${params.toString()}`);
					});
					e.preventDefault();
				}}
				className="h-auto aspect-square shrink-0 flex bg-[#FFFF00] items-center justify-center  border-[3px] border-black "
			>
				<Search className="text-black text-5xl" strokeWidth={4} />
			</button>
		</form>
	);
}
