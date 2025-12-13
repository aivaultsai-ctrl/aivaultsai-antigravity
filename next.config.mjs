import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
    turbopack: {},

    webpack: (config) => {
        const zodPath = require.resolve("zod");
        config.resolve.alias = {
            ...config.resolve.alias,
            "zod/v3": zodPath,
            "zod/v4": zodPath,
        };
        return config;
    },
};

export default nextConfig;
