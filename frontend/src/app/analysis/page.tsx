import { Suspense } from "react";
import { PageProgress } from "./page-progress.client";

export default async function Analysis() {
	return (
		<Suspense fallback={<></>}>
			<PageProgress />
		</Suspense>
	);
}
