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
// user agent is a known bot, and its built-in list predates Meta's current
// crawlers (meta-externalfetcher / meta-externalagent). Link previews only
// read <head>, so every preview crawler must get metadata there.
const htmlLimitedBots =
  /facebookexternalhit|Facebot|facebookcatalog|meta-external|WhatsApp|Twitterbot|TelegramBot|Slackbot|Discordbot|LinkedInBot|Pinterest|Viber|SkypeUriPreview|Snapchat|Applebot|Googlebot|bingbot|BingPreview|DuckDuckBot|kakaotalk-scrap|Line\/|Iframely|Embedly|redditbot|vkShare|quora link preview|Mediapartners-Google|ia_archiver|W3C_Validator/i;

/** @type {import('next').NextConfig} */
const nextConfig = {
  htmlLimitedBots,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
