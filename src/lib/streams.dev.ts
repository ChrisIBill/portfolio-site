export const outfileAddr = "pino.log.out.json" as const;
export const infofileAddr = "pino.log.info.json" as const;
export const serverFileAddr = "pino.log.server.json" as const;

export async function getAsyncFileWriteStream(props?: any) {
  return new Promise((resolve, reject) => {
    if (process.env.NEXT_RUNTIME === "nodejs") {
      console.log("getFileWriteStream", "nodejs");
      const fs = require("fs");
      const path = require("path");
      const filePath = path.join(props.path ?? "../../pino.log.out.json");

      try {
        console.log("getFileWriteStream", filePath);
        const write = fs.createWriteStream(filePath, { flags: "as+" });
        resolve(write);
      } catch (err) {
        reject({ message: "Error writing file", filePath, error: err });
      }
    } else {
      console.error("getFileWriteStream", "not nodejs");
      reject({ message: "Error writing file, not on node" });
    }
  });
}
export function getFileWriteStream(props?: any) {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const fs = require("fs");
    const path = require("path");
    const filePath = path.join(props.path ?? "../../pino.log.out.json");
    try {
      const write = fs.createWriteStream(filePath, { flags: "as+" });
      return write;
    } catch (err) {
      console.error({ message: "Error writing file", filePath, error: err });
      return null;
    }
  } else {
    console.error("getFileWriteStream", "not nodejs");
    return null;
  }
}
//await fs.open(filePath, "as+", (err: any, fd: any) => {
//  if (err) {
//    console.error({
//      message: "Error accessing file",
//      filePath,
//      error: err,
//    });
//    throw err;
//  }
