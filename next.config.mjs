import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,

  webpack: (config, { isServer }) => {
    // Alias @clerk/nextjs to local stubs so the app runs without Clerk keys
    if (isServer) {
      config.resolve.alias['@clerk/nextjs/server'] = path.resolve(__dirname, 'src/lib/clerk-stub-server.js')
      config.resolve.alias['@clerk/nextjs'] = path.resolve(__dirname, 'src/lib/clerk-stub.js')
    } else {
      config.resolve.alias['@clerk/nextjs'] = path.resolve(__dirname, 'src/lib/clerk-stub.js')
    }
    return config
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
