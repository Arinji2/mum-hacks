import { Star } from "lucide-react";
import Image from "next/image";

export function Card({ i }: { i: number }) {
	return (
		<div
			className="w-full h-auto gap-6 aspect-[9/16] max-h-[500px] border-[3px] border-black shadow-button flex flex-col items-center justify-start"
			key={i}
		>
			<div className="w-full relative h-[40%] ">
				<Image
					src={"/iphoneX.jpg"}
					alt="patterns"
					className={`w-full h-full absolute top-0 left-0 object-cover z-10`}
					fill
				/>
				<Image
					src="/pattern-2.jpg"
					alt="patterns"
					fill
					className="absolute top-0 left-0"
				/>
			</div>
			<div className="w-full h-fit flex flex-row items-center justify-between px-4">
				<h4 className="text-3xl font-bold ">{`Product ${i + 1}`}</h4>
				<div className="border-[3px] border-black bg-[#69d3e8] shadow-button px-3 p-1">
					<p className="text-black text-lg">Inventory</p>
				</div>
			</div>
			<p className="text-lg text-slate-600 line-clamp-2 px-3 ">{`A brief description of the product ${i + 1}, Its a pretty good product which i likey :)`}</p>

			<div className="w-full mt-auto pb-4 h-fit flex flex-col items-center justify-center gap-3">
				<div className="w-full h-[3px] px-3 ">
					<div className="w-full h-full bg-black"></div>
				</div>
				<div className="w-full h-fit flex flex-row items-center justify-between px-3">
					<div className="w-fit flex flex-row items-center justify-center gap-2">
						<Star className="text-slate-600 size-4 fill-slate-600" />
						<p className="text-slate-600 ">122 Reviews</p>
					</div>

					<p className="text-slate-600 text-lg font-medium">2023</p>
				</div>
			</div>
		</div>
	);
}
