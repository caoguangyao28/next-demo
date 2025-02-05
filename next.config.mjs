/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img1.doubanio.com',
      },
    ],
  },
};

export default nextConfig;
