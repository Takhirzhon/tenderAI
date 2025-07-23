// next.config.js
/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  images: {
  },
  basePath: isProd ? '/tender-front' : '',
  assetPrefix: isProd ? '/tender-front/' : '',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
