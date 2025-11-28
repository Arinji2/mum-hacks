import { Card } from "./card";
import { HeaderClient } from "./header.client";
export default async function HomePage() {
	return (
		<HeaderClient>
			<div className="w-full h-fit grid xl:grid-cols-3 gap-4 lg:grid-cols-2 grid-cols-1">
				{" "}
				{Array(10)
					.fill(0)
					.map((_, i) => (
						<Card key={i} i={i} />
					))}
			</div>
		</HeaderClient>
	);
}
