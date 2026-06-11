import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow the dev server to be reached via the machine's LAN IP. The wildcard
  // covers the IP shifting around on the same subnet so we don't have to keep
  // editing this. (localhost is always allowed.)
  allowedDevOrigins: ['172.16.197.137', '172.16.197.*'],
};

export default nextConfig;