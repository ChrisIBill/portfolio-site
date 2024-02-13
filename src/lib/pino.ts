import pino from "pino";
import customTransport from "./pino-transport";
import { getFileWriteStream, outfileAddr, infofileAddr } from "./streams";

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

type Stream = { stream: NodeJS.WriteStream; level?: string };
const streams: Stream[] = [{ stream: process.stdout }];

const multiStreams = () => {
  if (config.server) {
    console.log("multiStreams", streams);
    //const outfile = fsStreams('pino.log.out')

    getFileWriteStream({ outfileAddr })
      .then((stream) => {
        console.log("MultiStreams", stream);
        if (stream) streams.push({ stream });
      })
      .catch((err) => {
        console.error({
          message: "Error getting file write stream",
          error: err,
        });
      });
    getFileWriteStream({ infofileAddr })
      .then((stream) => {
        console.log("MultiStreams", stream);
        if (stream) streams.push({ stream, level: "info" });
      })
      .catch((err) => {
        console.error({
          message: "Error getting file write stream",
          error: err,
        });
      });
  } else {
    return undefined;
  }
};

const pinoConfig: any = {
  config: {
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
  },
};

if (config.serverUrl) {
  pinoConfig.config.browser = {
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
const logger = pino(pinoConfig.config, multiStreams());
logger.info({ message: "pino logger initialized", config, streams });
export const infolog = (msg: string) => logger.info(msg);
export const debuglog = (msg: string) => logger.debug(msg);

export default logger;
