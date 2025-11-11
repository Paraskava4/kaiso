const CompressionPlugin = require("compression-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const path = require("path");

const nextConfig = {
    reactStrictMode: false,
    devIndicators: false,

    // Disable source maps for production to reduce bundle size
    productionBrowserSourceMaps: false,

    // Enhanced performance optimizations
    experimental: {
        // Enable modern bundling
        esmExternals: true,
    },

    // Enhanced caching
    onDemandEntries: {
        // Period (in ms) where the server will keep pages in the buffer
        maxInactiveAge: 25 * 1000,
        // Number of pages that should be kept simultaneously without being disposed
        pagesBufferLength: 2,
    },

    // Build timeout configuration
    staticPageGenerationTimeout: 60, // 60 seconds timeout for static generation

    // Enhanced headers for SSR caching
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, s-maxage=300, stale-while-revalidate=600',
                    },
                    {
                        key: 'CDN-Cache-Control',
                        value: 'max-age=300',
                    },
                ],
            },
        ];
    },

    // Image configuration
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
            {
                protocol: "http",
                hostname: "192.168.1.27:2525",
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

    // Ensure correct project root for output file tracing in multi-lockfile setups
    outputFileTracingRoot: path.resolve(__dirname),

    // Compiler optimizations
    compiler: {
        removeConsole: process.env.NODE_ENV === "production",
        reactRemoveProperties: process.env.NODE_ENV === "production",
    },

    trailingSlash: true,
    skipTrailingSlashRedirect: true,

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

        // Enhanced bundle optimization
        if (!dev) {
            // Optimize chunks for better caching
            config.optimization.splitChunks = {
                chunks: 'all',
                cacheGroups: {
                    default: false,
                    vendors: false,
                    // Vendor chunk
                    vendor: {
                        name: 'vendor',
                        chunks: 'all',
                        test: /node_modules/,
                        priority: 20
                    },
                    // Common chunk
                    common: {
                        name: 'common',
                        minChunks: 2,
                        chunks: 'all',
                        priority: 10,
                        reuseExistingChunk: true,
                        enforce: true
                    },
                    // React chunk
                    react: {
                        name: 'react',
                        test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                        chunks: 'all',
                        priority: 30
                    },
                    // MUI chunk
                    mui: {
                        name: 'mui',
                        test: /[\\/]node_modules[\\/]@mui[\\/]/,
                        chunks: 'all',
                        priority: 25
                    }
                }
            };
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

        return config;
    },

    assetPrefix: process.env.NODE_ENV === "production" ? "" : "",
};

module.exports = nextConfig;
