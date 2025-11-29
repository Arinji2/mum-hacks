import PocketBase from "pocketbase";

export const pb = new PocketBase("https://db-clarity.arinji.com");

export const getAuthToken = async () => {
	const { token } = await pb
		.collection("_superusers")
		.authWithPassword("architshinde006@gmail.com", "CB-iC4yQI3OCiCP");
	return token;
};
