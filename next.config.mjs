/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif"],
    domains: ["hf1ttc1z4ihjagr5.public.blob.vercel-storage.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hf1ttc1z4ihjagr5.public.blob.vercel-storage.com",
        port: "",
        pathname: "/avatars/**",
      },
    ],
  },
};

export default nextConfig;
