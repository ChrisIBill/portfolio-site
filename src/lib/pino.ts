import pino from "pino";
import {
  getFileWriteStream,
  outfileAddr,
  infofileAddr,
  serverFileAddr,
} from "./streams.dev";

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
  streams: [],
};

if (config.serverUrl) {
  pinoConfig.browser = {
    transmit: {
      level: config.level,
      send: (
        level: any,
        logEvent: {
          messages?: any;
          level?: any;
          ts?: any;
          bindings?: any;
        },
      ) => {
        const { ts, bindings } = logEvent;
        const msg = logEvent.messages[0];
        const headers = {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "Origin, X-Requested-With, Content-Type, Accept",
          type: "application/json",
        };
        if (config.env === "development" && logEvent.level.value >= 20) {
          let blob = new Blob(
            [
              JSON.stringify({
                level,
                levelValue: logEvent.level?.value,
                origin: "browser",
                ts,
                bindings,
                msg,
              }),
            ],
            headers,
          );
          navigator.sendBeacon(config.serverUrl + "/pino.api", blob);
        }
      },
    },
  };
}

if (config.server && config.env === "development") {
  //if on server and in devel,
  //init file write streams for logs on server side
  const outfile = getFileWriteStream({ path: outfileAddr });
  const infofile = getFileWriteStream({ path: infofileAddr });
  const serverfile = getFileWriteStream({ path: serverFileAddr });
  outfile && streams.push({ stream: outfile });
  infofile && streams.push({ stream: infofile, level: "info" });
  serverfile && streams.push({ stream: serverfile });
  pinoConfig.multistream = pino.multistream(streams);
}

const logger =
  config.env === "development"
    ? pino(pinoConfig, pinoConfig.multistream || pinoConfig.streams)
    : pino(pinoConfig);

logger.info({
  message: "pino logger initialized",
});

export const infolog = (msg: string) => logger.info(msg);
export const debuglog = (msg: string) => logger.debug(msg);

export default logger;
