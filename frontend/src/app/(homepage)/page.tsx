import { Plus, Search } from "lucide-react";
import { Sidebar } from "./sidebar";
import { Card } from "./card";
import { Input } from "./input";
export default async function HomePage() {
	return (
		<div className="w-full flex relative flex-row items-start justify-start">
			<Sidebar />
			<div className="w-full h-full  flex flex-col gap-7 items-start justify-start py-6 px-4">
				<div className="w-full h-fit flex flex-col gap-2">
					<h2 className="font-bold text-5xl text-black">Google</h2>
					<p className="text-lg  text-slate-600">
						Products from google from 2018-current...
					</p>
				</div>

				<div className="w-full h-[3px] bg-black"></div>
				<Input />

				<div className="w-full h-fit grid xl:grid-cols-3 gap-4 lg:grid-cols-2 grid-cols-1">
					{" "}
					{Array(10)
						.fill(0)
						.map((_, i) => (
							<Card key={i} i={i} />
						))}
				</div>
			</div>
		</div>
	);
}
