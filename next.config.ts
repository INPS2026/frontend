/** @type {import('next').NextConfig} */

import { env } from './config';

console.log(env.NEXT_PUBLIC_API_URL);

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Proxy request to backend. Avoids CORS issues
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
