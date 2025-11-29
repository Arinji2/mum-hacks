import { analyzeProduct } from "@/lib/analyze-product.action";
import { getProduct } from "@/lib/getProduct.action";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function PageClient() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const productName = searchParams.get("productName");
	const brandName = searchParams.get("brandName");

	useEffect(() => {
		(async () => {
			if (!productName || !brandName) {
				router.replace("/");
			} else {
				await analyzeProduct(productName);
				const productID = await getProduct(productName);
				router.push(`/report/${productID}`);
			}
		})();
	}, [productName, brandName, router]);
	return <></>;
}
