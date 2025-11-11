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
  
  // Add rewrites to proxy verification API calls to microservice
  async rewrites() {
    return [
      {
        source: '/api/verification/:path*',
        destination: 'http://localhost:3003/:path*',
      },
    ]
  },

  // Use the new 'turbopack' key, not 'experimental.turbo'
  turbopack: {
    // Add your Turbopack rules here if needed
    // rules: {
    //   '*.svg': {
    //     loaders: ['@svgr/webpack'],
    //     as: '*.js',
    //   },
    // },
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        stream: false,
        crypto: false,
      }
    }
    
    // Fix the alias configuration
    config.resolve.alias = {
      ...config.resolve.alias,
      sharp: false,
      'onnxruntime-node': false,
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