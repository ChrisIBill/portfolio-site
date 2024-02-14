import pino from "pino";
import {
  getFileWriteStream,
  outfileAddr,
  infofileAddr,
  serverFileAddr,
} from "./streams";

export const enum LogLevelEnum {
  trace = "trace",
  debug = "debug",
  info = "info",
  warn = "warn",
  error = "error",
  fatal = "fatal",
}
export type LogLevel = keyof typeof LogLevelEnum;
export const LOG_LEVELS = [
  LogLevelEnum.trace,
  LogLevelEnum.debug,
  LogLevelEnum.info,
  LogLevelEnum.warn,
  LogLevelEnum.error,
] as const;
export type LogLevels = (typeof LOG_LEVELS)[number];
export function isLogLevel(level: string): level is LogLevel {
  return LOG_LEVELS.includes(level as LogLevels);
}

const config = {
  serverUrl: process.env.REACT_APP_API_PATH || "http://localhost:3000",
  env: process.env.NODE_ENV,
  publicUrl: process.env.PUBLIC_URL,
  level: process.env.NEXT_PUBLIC_PINO_LOG_LEVEL || "debug",
  server: process.env.NEXT_RUNTIME === "nodejs",
};

type Stream = {
  stream: NodeJS.WriteStream;
  level?: string;
  [key: string]: any;
};
const streams: Stream[] = [{ stream: process.stdout }];

function getMultiStreams() {
  if (config.server) {
    console.log("multiStreams");
    //const outfile = fsStreams('pino.log.out')

    Promise.all([
      getFileWriteStream({ path: outfileAddr })
        .then((stream) => {
          console.log("finished getFileWriteStream", outfileAddr);
          if (stream) streams.push({ stream });
        })
        .catch((err) => {
          console.error({
            message: "Error getting file write stream",
            error: err,
          });
        }),
      getFileWriteStream({ path: infofileAddr })
        .then((stream) => {
          console.log("finished getFileWriteStream", infofileAddr);
          if (stream) streams.push({ stream, level: "info" });
        })
        .catch((err) => {
          console.error({
            message: "Error getting file write stream",
            error: err,
          });
        }),
      getFileWriteStream({ path: serverFileAddr })
        .then((stream) => {
          console.log("finished getFileWriteStream", serverFileAddr);
          if (stream) streams.push({ stream });
        })
        .catch((err) => {
          console.error({
            message: "Error getting file write stream",
            error: err,
          });
        }),
    ]).then(() => {
      console.log("multiStreams promise finished");
    });
  }
}
const pinoConfig: any = {
  level: config.level,
  depthLimit: 5,
  edgeLimit: 5,
  browser: {
    asObject: true,
  },
  base: {
    level: "info",
    env: config.env,
  },
};

if (!config.server) {
  pinoConfig.browser = {
    transmit: {
      level: config.level,
      send: (level, logEvent) => {
        const { ts, bindings } = logEvent;
        const msg = logEvent.messages[0];
        const headers = {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "Origin, X-Requested-With, Content-Type, Accept",
          type: "application/json",
        };
        let blob = new Blob(
          [JSON.stringify({ origin: "browser", ts, bindings, msg, level })],
          headers,
        );
        if (logEvent.level.value >= 20)
          navigator.sendBeacon(config.serverUrl + "/pino.api", blob);
      },
    },
  };
}
if (config.server) {
  pinoConfig.transport = pino.transport({
    targets: [
      {
        target: "pino/file",
        level: "trace",
        options: { destination: "../../pino.log.out.json" },
      },
      {
        target: "pino/file",
        level: "info",
        options: {
          destination: "pin.log.info.json",
        },
      },
      {
        target: "pino/file",
        level: "debug",
        options: { destination: "pino.log.server.json" },
      },
    ],
  });
} else {
}
console.log("pinoTest: ", pinoConfig.transport);
const logger = pino(pinoConfig.transport ?? pinoConfig);
logger.info({
  message: "pino logger initialized",
  config,
});
export const infolog = (msg: string) => logger.info(msg);
export const debuglog = (msg: string) => logger.debug(msg);

export default logger;
