/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
				port: "3000",
				pathname: "/**",
			},

			{
				protocol: "http",
				hostname: "192.168.1.20",
				port: "3000",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "**.reviveteam.net",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "**.revivenode.com",
				pathname: "/**",
			},

			{
				protocol: "https",
				hostname: "**.revivenode.dev",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "reviveteam.net",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "revivenode.com",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;
