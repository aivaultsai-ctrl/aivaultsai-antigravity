// next.config.mjs
var nextConfig = {
  // Firebase Web Frameworks handles everything
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  }
};
var next_config_default = nextConfig;
export {
  next_config_default as default
};
