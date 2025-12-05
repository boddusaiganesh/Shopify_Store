/** @type {import('next').NextConfig} */
const nextConfig = {
    // Suppress warnings from browser extensions
    reactStrictMode: true,
    // Optimize for production
    swcMinify: true,
    // Improve performance
    poweredByHeader: false,
};

module.exports = nextConfig;
