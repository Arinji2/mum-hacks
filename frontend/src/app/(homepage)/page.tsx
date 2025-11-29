import { Cards } from "./card";
import { HeaderClient } from "./header.client";
import { readFile } from "fs/promises";
export type Mapping = {
	name: string;
	brand: string;
	year: number;
	image_path?: string;
};
export default async function HomePage({
	searchParams,
}: {
	searchParams: Promise<{ search: string; brand: string }>;
}) {
	const { search, brand } = await searchParams;
	const mappingData = await readFile("./lib/mapping.json", "utf8");
	const mapping: Mapping[] = JSON.parse(mappingData);

	let filtered =
		search && search.length > 0
			? mapping.filter((mappingData) =>
					mappingData.name.toLowerCase().includes(search),
				)
			: mapping;

	filtered =
		brand && brand.length > 0
			? filtered.filter(
					(mappingData) =>
						mappingData.brand.toLowerCase() === brand.toLowerCase(),
				)
			: filtered;

	return (
		<HeaderClient>
			<Cards mappingData={filtered} />
		</HeaderClient>
	);
}
