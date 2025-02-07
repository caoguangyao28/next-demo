/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.doubanio.com',
      },
    ],
  },
};

export default nextConfig;
