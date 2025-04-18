/** @type {import('next').NextConfig} */
const nextConfig = {
 reactStrictMode: true,
 swcMinify: true,
 images: {
   domains: ['localhost', 'vercel.app'],
   remotePatterns: [
     {
       protocol: 'https',
       hostname: '**',
     },
   ],
   unoptimized: true,
 },
 experimental: {
   serverActions: true,
 },
 eslint: {
   ignoreDuringBuilds: true,
 },
 typescript: {
   ignoreBuildErrors: true,
 },
}

export default nextConfig
