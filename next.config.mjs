/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  
  serverExternalPackages: ['fs', 'path', 'bcryptjs'],
  
  // Proper Turbopack configuration with exclusions
  experimental: {
    turbo: {
      // Exclude database directories from file watching
      exclude: [
        '**/pgdata_test/**',
        '**/pgdata_live/**',
        '**/.git/**',
        '**/node_modules/**'
      ],
      // Resolve aliases for Turbopack
      resolveAlias: {
        'sharp': false,
        'onnxruntime-node': false,
      },
    },
  },
  
  // Webpack configuration (kept for compatibility)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        stream: false,
        crypto: false,
      }
    }
    
    config.resolve.alias = {
      ...config.resolve.alias,
      sharp$: false,
      'onnxruntime-node$': false,
    }
    
    return config
  },
  
  // Allow serving static files from uploads directory
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, OPTIONS',
          },
        ],
      },
    ]
  },
  
  reactStrictMode: true,
}

export default nextConfig