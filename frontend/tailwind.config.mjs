import tailwindcssAnimate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";
import plugins from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
const config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	plugins: [
		tailwindcssAnimate,
		typography,
		plugins(({ addComponents, addUtilities }) => {
			addComponents({
				".bg-brand-background-radical": {
					background: "radial-gradient(at center top, #0E0E0E, #070707)",
				},
			});
			addUtilities({
				".screen-padding": {
					paddingLeft: "1rem", // Default px-4
					paddingRight: "1rem",
					"@screen md": {
						paddingLeft: "0.5rem", // md:px-2
						paddingRight: "0.5rem",
					},
					"@screen 2xl": {
						paddingLeft: "0", // 2xl:px-0
						paddingRight: "0",
					},
				},
			});
		}),
		require("tailwindcss-animate"),
	],
	theme: {
		container: {
			center: true,
			padding: {
				"2xl": "2rem",
				DEFAULT: "1rem",
				lg: "2rem",
				md: "2rem",
				sm: "1rem",
				xl: "2rem",
			},
			screens: {
				"2xl": "86rem",
				lg: "64rem",
				md: "48rem",
				sm: "40rem",
				xl: "80rem",
			},
		},
		extend: {
			height: {
				navbar: "5rem",
				"full-navbar": "calc(100svh - 5rem)",
			},
			minHeight: {
				"full-navbar": "calc(100svh - 5rem)",
			},
			maxWidth: {
				"outer-max": "1280px",
			},
			boxShadow: {
				button: "4px 4px 0px 0px #000",
				buttonHover: "2px 2px 0px 0px #000",
			},
			colors: {
				main: "#FFFF00",
				offwhite: "#4b5563",
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				background: "hsl(var(--background))",
				border: "hsl(var(--border))",
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				foreground: "hsl(var(--foreground))",
				input: "hsl(var(--input))",
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				ring: "hsl(var(--ring))",
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				sentiments: {
					positive: "#86efac",
					negative: "#fca5a5",
					neutral: "#EFEF86",
				},
				success: "hsl(var(--success))",
				error: "hsl(var(--error))",
				warning: "hsl(var(--warning))",
				chart: {
					1: "hsl(var(--chart-1))",
					2: "hsl(var(--chart-2))",
					3: "hsl(var(--chart-3))",
					4: "hsl(var(--chart-4))",
					5: "hsl(var(--chart-5))",
				},
			},
			fontFamily: {
				mono: ["var(--font-geist-mono)"],
				sans: ["var(--font-geist-sans)"],
			},
			keyframes: {
				"accordion-down": {
					from: {
						height: "0",
					},
					to: {
						height: "var(--radix-accordion-content-height)",
					},
				},
				"accordion-up": {
					from: {
						height: "var(--radix-accordion-content-height)",
					},
					to: {
						height: "0",
					},
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
		},
	},
};

export default config;
