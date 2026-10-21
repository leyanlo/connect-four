/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  outputFileTracingRoot: import.meta.dirname,
  images: { unoptimized: true },
};

export default nextConfig;
