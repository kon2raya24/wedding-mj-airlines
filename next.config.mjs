const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

// Next streams page metadata into the body for dynamic pages unless the
// user agent is a known bot. Link previews only read <head>, and some are
// fetched with an ordinary browser identity (Messenger end-to-end chats
// fetch from the sender's device), so every request gets metadata in
// <head>. The cost is negligible here: our metadata is static.
const htmlLimitedBots = /./;

/** @type {import('next').NextConfig} */
const nextConfig = {
  htmlLimitedBots,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
