import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF8700",
          foreground: "#FFFFFF",
          light: "#FFB27F",
          dark: "#DB6D00",
          muted: "#FFF4E6",
        },
        gray: {
          25: "#FCFCFD",
          50: "#F7F7F8",
          100: "#EFEFF0",
          200: "#E1E1E2",
          300: "#C6C6C8",
          400: "#A1A1A4",
          500: "#5F5F62",
          600: "#3E3E3E",
          700: "#2A2A2C",
          overlay: "#5F5F62",
          border: "#C6C6C8",
          text: "#3E3E3E",
        },
        success: {
          DEFAULT: "#16A34A",
          surface: "#DCFCE7",
        },
        warning: {
          DEFAULT: "#FACC15",
          surface: "#FEF9C3",
        },
        danger: {
          DEFAULT: "#DC2626",
          surface: "#FEE2E2",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-pretendard-jp)",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem", fontWeight: "500" }],
        sm: ["0.875rem", { lineHeight: "1.25rem", fontWeight: "500" }],
        md: ["1rem", { lineHeight: "1.5rem", fontWeight: "500" }],
        lg: ["1.125rem", { lineHeight: "1.75rem", fontWeight: "600" }],
        xl: ["1.25rem", { lineHeight: "1.75rem", fontWeight: "600" }],
        "2xl": ["1.5rem", { lineHeight: "2rem", fontWeight: "700" }],
      },
      spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
      },
      borderRadius: {
        xs: "2px",
        sm: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
        pill: "999px",
      },
      screens: {
        xs: "360px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },
      boxShadow: {
        dialog:
          "0px 16px 32px rgba(29, 33, 45, 0.1), 0px 1px 4px rgba(29, 33, 45, 0.15), 0px 0px 1px rgba(29, 33, 45, 0.2)",
      },
    },
  },
  corePlugins: {
    preflight: true,
  },
  plugins: [],
};

export default config;
