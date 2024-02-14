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
  // webpack: (config, options) => {
  //   config.module.rules.push(
  //     {
  //       "thread-stream-worker": pinoWebpackAbsolutePath(
  //         "./thread-stream-worker.js",
  //       ),
  //     },
  //     { "pino/file": pinoWebpackAbsolutePath("./pino-file.js") },
  //     { "pino-worker": pinoWebpackAbsolutePath("./pino-worker.js") },
  //     {
  //       "pino-pipeline-worker": pinoWebpackAbsolutePath(
  //         "./pino-pipeline-worker.js",
  //       ),
  //     },
  //     { "pino-pretty": pinoWebpackAbsolutePath("./pino-pretty.js") },
  //   );
  //   return config;
  // },
};

module.exports = nextConfig;
