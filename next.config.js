/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://dev-assignment-env.eba-vpitzthp.ap-northeast-2.elasticbeanstalk.com";

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Link",
            value: `<${API_BASE_URL}>; rel=preconnect, <${API_BASE_URL}>; rel=dns-prefetch`,
          },
        ],
      },
    ];
  },

  experimental: {
    optimizeCss: true,
  },
};

module.exports = nextConfig;
