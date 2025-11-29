import { Cards } from "./card";
import { HeaderClient } from "./header.client";
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
	const response = await fetch("http://cdn.arinji.com/u/TppaYA.json");
	const mapping: Mapping[] = await response.json();

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
