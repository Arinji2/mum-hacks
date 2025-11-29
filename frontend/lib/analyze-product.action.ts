"use server";
export async function analyzeProduct(productName: string) {
	const response = await fetch(
		`https://clarity-backend.arinji.com/process-product`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				accept: "application/json",
			},
			body: JSON.stringify({
				product: productName,
			}),
		},
	);
	console.log(response.status);
}
