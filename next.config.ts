/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Remove appDir if present - not needed in Next.js 15
  },
  compiler: {
    emotion: true,
  },
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
  },
};

module.exports = nextConfig;
