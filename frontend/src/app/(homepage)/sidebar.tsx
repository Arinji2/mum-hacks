"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function Sidebar({ showSidebar }: { showSidebar: boolean }) {
	const searchParams = useSearchParams();
	const params = new URLSearchParams(searchParams);
	const router = useRouter();
	const pathname = usePathname();

	// current selected brand
	const activeBrand = searchParams.get("brand") || "";

	function toggleBrand(brand: string) {
		// If the user clicks the same brand -> unselect
		if (activeBrand === brand) {
			params.delete("brand");
		} else {
			params.set("brand", brand);
		}

		router.replace(`${pathname}?${params.toString()}`);
	}

	return (
		<div
			className={cn(
				"w-[80%] overflow-scroll md:translate-x-0 transition-all ease-in-out duration-200 -translate-x-[100%] h-[100svh] bg-white z-30 md:w-[20%] fixed md:sticky top-0 shrink-0 flex py-6 px-4 gap-10 flex-col items-start justify-start border-r-[3px] border-black",
				{
					"translate-x-0": showSidebar,
				},
			)}
		>
			{/* HEADER */}
			<div className="w-full h-fit gap-2 flex flex-row items-center justify-start">
				<div className="size-10 relative ">
					<Image fill src="/logo.jpeg" alt="logo" />
				</div>
				<h1 className="text-black text-3xl font-bold">Clarity</h1>
			</div>

			<div className="w-full h-fit flex flex-col items-start gap-3 justify-start">
				<div className="w-full h-fit flex flex-row items-start justify-start">
					<h2 className="text-black font-semibold text-2xl">Brands</h2>
				</div>

				<div className="w-full h-fit flex flex-col border-l-[3px] border-black px-4 items-start gap-3">
					<button
						onClick={() => toggleBrand("google")}
						className={cn(
							"w-full text-left p-2 border-[3px] border-black",
							activeBrand === "google"
								? "bg-[#FFFF00] shadow-button"
								: "bg-transparent",
						)}
					>
						<p className="text-lg font-medium text-black">Google</p>
					</button>

					<button
						onClick={() => toggleBrand("nvidia")}
						className={cn(
							"w-full p-2 text-left border-[3px] border-black",
							activeBrand === "nvidia"
								? "bg-[#FFFF00] shadow-button"
								: "bg-transparent",
						)}
					>
						<p className="text-lg font-medium text-black">Nvidia</p>
					</button>

					<button
						onClick={() => toggleBrand("meta")}
						className={cn(
							"w-full p-2 border-[3px] text-left border-black",
							activeBrand === "meta"
								? "bg-[#FFFF00] shadow-button"
								: "bg-transparent",
						)}
					>
						<p className="text-lg font-medium text-black">Meta</p>
					</button>

					<button
						onClick={() => toggleBrand("apple")}
						className={cn(
							"w-full p-2 border-[3px] text-left border-black",
							activeBrand === "apple"
								? "bg-[#FFFF00] shadow-button"
								: "bg-transparent",
						)}
					>
						<p className="text-lg font-medium text-black">Apple</p>
					</button>
				</div>
			</div>

			<div className="w-full h-[3px] bg-black"></div>
		</div>
	);
}
