import {
  infofileAddr,
  outfileAddr,
  serverFileAddr,
} from "@/app/pino.api/route.dev";
import pino from "pino";

const config = {
  serverUrl: process.env.REACT_APP_API_PATH || "http://localhost:3000",
  env: process.env.NODE_ENV,
  publicUrl: process.env.PUBLIC_URL,
  level: process.env.NEXT_PUBLIC_PINO_LOG_LEVEL || "debug",
  server: process.env.NEXT_RUNTIME === "nodejs",
};

const send = (level: any, logEvent: any) => {
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
  streams: [{ stream: process.stdout }],
};

if (config.serverUrl) {
  pinoConfig.config.browser = {
    transmit: {
      level: config.level,
      send: (level: any, logEvent: any) => send(level, logEvent),
    },
  };
}

if (config.server && config.env === "development") {
  const outfile = pino.destination({
    dest: outfileAddr,
    append: true,
    sync: true,
  });
  const infofile = pino.destination({
    dest: infofileAddr,
    append: true,
    sync: true,
  });
  const serverfile = pino.destination({
    dest: serverFileAddr,
    append: true,
    sync: true,
  });

  outfile && pinoConfig.streams.push({ stream: outfile });
  infofile && pinoConfig.streams.push({ stream: infofile, level: "info" });
  serverfile && pinoConfig.streams.push({ stream: serverfile });

  pinoConfig.streams = pino.multistream(pinoConfig.streams);
}

const logger =
  config.env === "development"
    ? pino(pinoConfig.config, pinoConfig.multistream || pinoConfig.streams)
    : pino(pinoConfig.config);

logger.info({
  message: "pino logger initialized",
});

export const infolog = (msg: string) => logger.info(msg);
export const debuglog = (msg: string) => logger.debug(msg);

export default logger;
