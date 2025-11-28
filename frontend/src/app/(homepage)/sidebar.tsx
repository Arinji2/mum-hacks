import { Checkbox } from "@/components/ui/checkbox";

export function Sidebar() {
	return (
		<div className="w-[20%] sticky top-0 shrink-0 flex py-6 px-4  gap-10 flex-col items-start justify-start h-full border-r-[3px] border-black">
			<div className="w-full h-fit gap-2 flex flex-row items-center justify-start">
				<div className="size-10 bg-black"></div>
				<h1 className="text-black text-3xl font-bold">Clarity</h1>
			</div>
			<div className="w-full h-fit flex flex-col items-start gap-3 justify-start">
				<div className="w-full h-fit flex flex-row items-start justify-start">
					<h2 className="text-black font-semibold text-2xl">Brands</h2>
				</div>
				<div className="w-full h-fit flex flex-col border-l-[3px] border-black px-4 items-center justify-center gap-3">
					<div className="w-full bg-[#FFFF00] border-[3px] p-2  shadow-button border-black">
						<p className="text-lg font-medium text-black">Google</p>
					</div>
					<div className="w-full px-2  ">
						<p className="text-lg font-medium text-black">Nvidia</p>
					</div>
					<div className="w-full px-2  ">
						<p className="text-lg font-medium text-black">Meta</p>
					</div>
					<div className="w-full px-2  ">
						<p className="text-lg font-medium text-black">Apple</p>
					</div>
				</div>
			</div>
			<div className="w-full h-fit flex flex-col items-start gap-3 justify-start">
				<div className="w-full h-fit flex flex-row items-start justify-start">
					<h2 className="text-black font-semibold text-2xl tracking-[13%]">
						FILTERS
					</h2>
				</div>
				<div className="w-full gap-2 h-fit flex flex-row items-center justify-start">
					<Checkbox />
					<p className="text-xl font-medium">All</p>
				</div>
				<div className="w-full gap-2 h-fit flex flex-row items-center justify-start">
					<Checkbox />
					<p className="text-xl font-medium">Inventory</p>
				</div>
				<div className="w-full gap-2 h-fit flex flex-row items-center justify-start">
					<Checkbox />
					<p className="text-xl font-medium">Custom</p>
				</div>

				<div className="w-full h-fit flex flex-col border-l-[3px] border-black px-4 items-center justify-center gap-3"></div>
			</div>
			<div className="w-full h-[3px] bg-black"></div>
			<div className="w-full h-fit flex flex-col items-start gap-3 justify-start">
				<div className="w-full h-fit flex flex-row items-start justify-start">
					<h2 className="text-black font-semibold text-2xl tracking-[13%]">
						SORTERS
					</h2>
				</div>
				<div className="w-full h-fit p-3 border-[3px] border-black ">
					<p>Sort by Reviews</p>
				</div>
				<div className="w-full h-fit p-3 border-[3px] border-black ">
					<p>Sort by Product Year</p>
				</div>
				<div className="w-full h-fit flex flex-col border-l-[3px] border-black px-4 items-center justify-center gap-3"></div>
			</div>
		</div>
	);
}
