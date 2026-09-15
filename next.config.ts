import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pj-cranes.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.pj-cranes.com",
        pathname: "/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
