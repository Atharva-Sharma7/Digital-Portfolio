/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow local /public images — Next.js handles these automatically.
    // Add remote domains here if you later use externally hosted images.
    remotePatterns: [],
    // Serve thumbnails in WebP automatically for browsers that support it.
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;
