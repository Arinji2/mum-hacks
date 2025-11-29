"use server";
import { getAuthPB } from "./pocketbase";

export const getProduct = async (productName: string) => {
	const pb = await getAuthPB();
	const products = await pb
		.collection("products")
		.getFirstListItem(`product='${productName}'`);
	return products.id;
};
