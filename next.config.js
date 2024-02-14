/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:slug*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "index, follow",
          },
        ],
      },
    ];
  },
};

module.exports = {
  ...nextConfig,
  pageExtensions: ["tsx", "ts", "js", "jsx"]
    .map((extension) => {
      const isDev = process.env.NODE_ENV === "development";
      const prefixes = isDev ? ["dev"] : ["prod"];
      return [
        `${extension}`,
        ...prefixes.map((prefix) => `${prefix}.${extension}`),
      ];
    })
    .flat(),
};
