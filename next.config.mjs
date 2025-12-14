import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    typescript: {
        ignoreBuildErrors: true,
    },

    webpack: (config) => {
        // Fix for Zod v3/v4 compatibility in AI SDK.
        // We resolve the absolute path to 'zod' (root index) and force aliases to it.
        // This fails if done at top-level during Vercel's pre-install scan, so we do it here inside the build function.
        try {
            const zodPath = require.resolve("zod");
            config.resolve.alias = {
                ...config.resolve.alias,
                "zod/v3": zodPath,
                "zod/v4": zodPath,
            };
        } catch (e) {
            // If Zod is not installed yet (e.g. Vercel scan), we skip the alias. 
            // The build would fail anyway later if dependencies aren't installed.
            console.warn("Could not resolve 'zod' for aliasing. This is normal during pre-build scans.");
        }
        return config;
    },
};

export default nextConfig;
