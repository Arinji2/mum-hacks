import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Plus, Search, Star } from "lucide-react";
export default async function HomePage() {
	return (
		<div className="w-full flex relative flex-row items-start justify-start">
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
			<div className="w-full h-full  flex flex-col gap-7 items-start justify-start py-6 px-4">
				<div className="w-full h-fit flex flex-col gap-2">
					<h2 className="font-bold text-5xl text-black">Google</h2>
					<p className="text-lg  text-slate-600">
						Products from google from 2018-current...
					</p>
				</div>

				<div className="w-full h-[3px] bg-black"></div>
				<div className="w-full flex flex-row items-stretch justify-start gap-3">
					<div className="w-full p-3  border-[3px] border-black  h-fit flex flex-row items-center justify-start gap-2">
						<Search className="text-slate-600 text-lg" />
						<p className="text-slate-600 text-lg">Search Products...</p>
					</div>
					<div className="h-auto aspect-square shrink-0 flex bg-[#FFFF00] items-center justify-center  border-[3px] border-black ">
						<Plus className="text-black text-5xl" strokeWidth={4} />
					</div>
				</div>

				<div className="w-full h-fit grid xl:grid-cols-3 gap-4 lg:grid-cols-2 grid-cols-1">
					{" "}
					{Array(10)
						.fill(0)
						.map((_, i) => (
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
						))}
				</div>
			</div>
		</div>
	);
}
