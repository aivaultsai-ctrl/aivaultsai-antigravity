/** @type {import('next').NextConfig} */
const nextConfig = {
    turbopack: {},

    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            "zod/v3": "zod",
            "zod/v4": "zod",
        };
        return config;
    },
};

export default nextConfig;
