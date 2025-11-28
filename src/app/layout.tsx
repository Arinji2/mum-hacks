import React from "react";

import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const space_grotesk = Space_Grotesk({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={space_grotesk.className}>
			<body className="flex w-full flex-col items-center justify-start bg-transparent">
				{children}
			</body>
		</html>
	);
}
