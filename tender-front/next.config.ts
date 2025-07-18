import { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  images: {
    domains: ['/tender-UI/'],
  },
  basePath: isProd ? '/tender-UI' : '',
  assetPrefix: isProd ? '/tender-UI/' : '',
  trailingSlash: true,
};

export default nextConfig;