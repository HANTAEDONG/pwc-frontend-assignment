import localFont from "next/font/local";

export const pretendardJP = localFont({
  src: [
    {
      path: "../public/fonts/PretendardJP-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/PretendardJP-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/PretendardJP-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/PretendardJP-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-pretendard-jp",
  display: "swap",
  preload: true,
  fallback: ["-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
});
