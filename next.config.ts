import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  serverExternalPackages: ['lightningcss'],
  experimental: {
    // Asegura que los módulos nativos se copien correctamente en Vercel
    outputFileTracingIncludes: {
      '/': ['./node_modules/lightningcss/**/*'],
    },
  },
};

export default nextConfig;
