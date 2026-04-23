/** @type {import('next').NextConfig} */
const nextConfig = {
  // Zero-retention architecture: we never write uploaded files to disk.
  // Everything stays in memory from upload → Claude → PDF output.
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
  webpack: (config) => {
    // pdfjs-dist uses node's canvas by default; disable it on the server.
    config.resolve.alias.canvas = false;
    return config;
  },
};

module.exports = nextConfig;
