import type { NextConfig } from "next";

const LINK_HEADER = [
  '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
  '</llms.txt>; rel="describedby"; type="text/plain"',
].join(", ");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/",
        headers: [{ key: "Link", value: LINK_HEADER }],
      },
      {
        source: "/s/:code",
        headers: [{ key: "Link", value: LINK_HEADER }],
      },
    ];
  },
};

export default nextConfig;
