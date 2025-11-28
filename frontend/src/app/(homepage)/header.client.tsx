"use client";

import { Menu, X } from "lucide-react";
import { Input } from "./input";
import { Sidebar } from "./sidebar";
import { useState } from "react";

export function HeaderClient({ children }: { children: React.ReactNode }) {
	const [showSidebar, setShowSidebar] = useState(false);
	return (
		<div className="w-full flex relative flex-row items-start justify-start">
			<Sidebar showSidebar={showSidebar} />
			<div className="w-full h-full  flex flex-col gap-7 items-start justify-start py-6 px-4">
				<div className="w-full h-fit flex flex-col gap-2">
					<div className="w-full h-fit flex flex-row items-center justify-between">
						<h2 className="font-bold text-5xl text-black">Google</h2>
						<button
							onClick={() => {
								setShowSidebar((prev) => !prev);
							}}
							className=""
						>
							{showSidebar ? (
								<X className="md:hidden block text-black text-5xl" />
							) : (
								<Menu className="md:hidden block text-black text-5xl" />
							)}
						</button>
					</div>
					<p className="text-lg  text-slate-600">
						Products from google from 2018-current...
					</p>
				</div>

				<div className="w-full h-[3px] bg-black"></div>
				<Input />
				{children}
			</div>
		</div>
	);
}
