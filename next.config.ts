/** @type {import('next').NextConfig} */
const nextConfig = {
  // Is option ko check karein
  experimental: {
    typedRoutes: false, // temporarily false karke build reset karein
  },
};

export default nextConfig;