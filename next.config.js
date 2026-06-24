/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig = {
  output: "export",
  basePath: isGitHubPages ? "/ukulele-practice" : "",
  assetPrefix: isGitHubPages ? "/ukulele-practice/" : "",
};

module.exports = nextConfig;
