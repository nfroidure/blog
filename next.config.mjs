/** @type {import('next').NextConfig} */
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
const basePath = "";
const assetPrefix = `${baseURL}${basePath}`;

const nextConfig = {
  output: "export",
  trailingSlash: false,
  distDir: "out",
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  basePath,
  assetPrefix,
  basePath,
  swcMinify: true,
};

export default nextConfig;
