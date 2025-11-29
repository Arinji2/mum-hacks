"use client";
import Image from "next/image";
import { Mapping } from "./page";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useRouter } from "next/navigation";

export function Cards({ mappingData }: { mappingData: Mapping[] }) {
	const [parent, _] = useAutoAnimate();
	return (
		<div
			ref={parent}
			className="w-full h-fit grid xl:grid-cols-3 gap-4 lg:grid-cols-2 grid-cols-1"
		>
			{mappingData.map((mappingData, i) => (
				<Card key={i} i={i} mappingData={mappingData} />
			))}
		</div>
	);
}
export function Card({ i, mappingData }: { i: number; mappingData: Mapping }) {
	const router = useRouter();
	return (
		<div
			onClick={() => {
				router.push(
					`/analysis?productName=${encodeURIComponent(mappingData.name)}&brandName=${encodeURIComponent(mappingData.brand)}`,
				);
			}}
			className="w-full h-auto gap-6 aspect-[9/16] max-h-[300px] border-[3px] border-black hover:shadow-buttonHover shadow-button flex flex-col items-center justify-start"
			key={i}
		>
			<div className="w-full relative h-[40%] ">
				<Image
					src={
						mappingData.image_path
							? `/products${mappingData.image_path}.jpg`
							: `/products/${mappingData.brand}/brand.jpg`
					}
					unoptimized={i > 20 ? true : false}
					alt="Product Image"
					className={`w-full h-full absolute top-0 left-0 object-cover z-10`}
					fill
				/>
			</div>
			<div className="w-full h-fit flex flex-row items-center justify-between px-4">
				<h4 className="text-3xl font-bold ">{mappingData.name}</h4>
				<div className="border-[3px] border-black bg-[#69d3e8] shadow-button px-3 p-1">
					<p className="text-black text-lg">Inventory</p>
				</div>
			</div>

			<div className="w-full mt-auto pb-4 h-fit flex flex-col items-center justify-center gap-3">
				<div className="w-full h-[3px] px-3 ">
					<div className="w-full h-full bg-black"></div>
				</div>
				<div className="w-full h-fit flex flex-row items-center justify-between px-3">
					{/* <div className="w-fit flex flex-row items-center justify-center gap-2"> */}
					{/* 	<Star className="text-slate-600 size-4 fill-slate-600" /> */}
					{/* 	<p className="text-slate-600 ">122 Reviews</p> */}
					{/* </div> */}

					<p className="text-slate-600 text-lg font-medium">
						{mappingData.year}
					</p>
				</div>
			</div>
		</div>
	);
}
