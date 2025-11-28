import { Search } from "lucide-react";

export function Input() {
	return (
		<div className="w-full flex flex-row items-stretch justify-start gap-3">
			<div className="w-full p-3  border-[3px] border-black  h-fit flex flex-row items-center justify-start gap-2">
				<Search className="text-slate-600 text-lg" />
				<input
					type="text"
					className=" w-full  outline-none text-black text-lg"
					placeholder="Search Products..."
				/>
			</div>
			<div className="h-auto aspect-square shrink-0 flex bg-[#FFFF00] items-center justify-center  border-[3px] border-black ">
				<Search className="text-black text-5xl" strokeWidth={4} />
			</div>
		</div>
	);
}
