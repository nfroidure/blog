/** @type {import('next').NextConfig} */
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
const basePath = "";
const assetPrefix = `${baseURL}${basePath}`;

async function redirects() {
  return [
    {
      source: "/",
      destination: "/en",
      permanent: true,
    },
  ];
}

const nextConfig = {
  output: "export",
  trailingSlash: false,
  distDir: "out",
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  baseURL,
  basePath,
  assetPrefix,
  basePath,
  swcMinify: true,
  experimental: {
    typedRoutes: true,
  },
  redirects,
};

export default nextConfig;
