import CompressionPlugin from "compression-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "kaiso.kmsoft.org",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "api.kaisoresearch.com",
                pathname: "/**",
            },
            // {
            //     protocol: "http",
            //     hostname: "192.168.1.27:2525",
            //     pathname: "/**",
            // },
            {
                protocol: "http",
                hostname: "192.168.1.11:2525",
                pathname: "/**",
            },
            {
                protocol: "http",
                hostname: "192.168.1.11",
                pathname: "/**",
            },
        ],
        deviceSizes: [320, 420, 768, 1024, 1200, 1600, 1920], // control responsive breakpoints
        imageSizes: [384, 384, 384, 384, 384, 384, 384, 384],
        formats: ["image/webp", "image/avif"],
        minimumCacheTTL: 60,
        dangerouslyAllowSVG: true,
        qualities: [65, 70, 75, 85, 90, 100], // Configure allowed image qualities
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    webpack: (config, { dev, isServer }) => {
        // Bundle analyzer
        if (dev && !isServer && process.env.ANALYZE === "true") {
            config.plugins.push(
                new BundleAnalyzerPlugin({
                    analyzerMode: "server",
                    openAnalyzer: true,
                    analyzerHost: "127.0.0.1",
                    analyzerPort: Number(process.env.ANALYZER_PORT) || 8000,
                })
            );
        }

        // Compression only in production client build
        if (!dev && !isServer) {
            config.plugins.push(
                new CompressionPlugin({
                    filename: "[path][base].gz",
                    algorithm: "gzip",
                    test: /\.(js|css|html|svg)$/,
                    threshold: 10240,
                    minRatio: 0.8,
                }),
                new CompressionPlugin({
                    filename: "[path][base].br",
                    algorithm: "brotliCompress",
                    test: /\.(js|css|html|svg)$/,
                    compressionOptions: { level: 11 },
                    threshold: 10240,
                    minRatio: 0.8,
                })
            );
        }

        // Let Next.js handle bundle splitting automatically for optimal performance

        return config;
    },
    assetPrefix: process.env.NODE_ENV === "production" ? "" : "",
};

export default nextConfig;
