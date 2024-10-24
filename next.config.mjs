/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.polygon.io",
        port: "",
        pathname: "/v3/reference/tickers/**",
      },
      {
        protocol: "https",
        hostname: "api.polygon.io",
        port: "",
        pathname: "/v1/reference/company-branding/**",
      },
    ],
  },
}

export default nextConfig
