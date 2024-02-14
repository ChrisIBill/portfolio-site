//export const dynamic = "force-dynamic";
import { NextApiResponse } from "next/types";
import { appendFile } from "fs/promises";
import logger from "@/lib/pino";

export const outfileAddr = "pino.log.out.json" as const;
export const infofileAddr = "pino.log.info.json" as const;
export const serverFileAddr = "pino.log.server.json" as const;

//export async function GET(req: NextApiRequest, res: NextApiResponse) {
//  console.log("GET: ", req);
//  return res.status(200).json({ message: "GET" });
//}

const PostLog = logger.child({ module: "Post" });
async function writeToFile(props: any) {
  return new Promise((resolve, reject) => {
    try {
      if (props.level > props.request.levelValue)
        return resolve({ message: "Level too low" });
      appendFile(props.path, JSON.stringify(props.request, null, "\n"), {
        flag: "as+",
      })
        .then(() => {
          resolve({ message: "File written", path: props.path });
        })
        .catch((err) => {
          reject({ message: "Error writing file", error: err, props });
        });
    } catch (err) {
      PostLog.error({
        message: "Error writing file",
        error: err,
        props,
      });
    }
  });
}
export async function POST(req: Request, res: NextApiResponse) {
  PostLog.debug({ message: "Received POST request" });
  const request = await req.json();
  const path = require("path");
  const outfilePath = path.join(process.cwd(), "pino.log.out.json");
  const clientPath = path.join(process.cwd(), "pino.log.client.json");
  const infoPath = path.join(process.cwd(), "pino.log.info.json");

  return Promise.allSettled([
    writeToFile({ path: outfilePath, request }),
    writeToFile({ path: clientPath, request }),
    writeToFile({ path: infoPath, level: 30, request }),
  ])
    .then((results) => {
      return Response.json({ status: 200, message: "POST" });
    })
    .catch((err) => {
      console.error({ message: "Error writing to file", error: err });
      return Response.json({ status: 500, message: "POST" });
    });
}
//export async function PUT(req: NextApiRequest, res: NextApiResponse) {
//  console.log("PUT: ", req.body);
//  return Response.json({ status: 200, message: "PUT" });
//}
//export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
//  console.log("DELETE: ", req.body);
//
//  return Response.json({ status: 200, message: "DELETE" });
//}
//export async function PATCH(req: NextApiRequest, res: NextApiResponse) {
//  console.log("PATCH: ", req.body);
//  return Response.json({ status: 200, message: "PATCH" });
//}
//export async function OPTIONS(req: NextApiRequest, res: NextApiResponse) {
//  console.log("OPTIONS: ", req.body);
//  return Response.json({ status: 200, message: "OPTIONS" });
//}
//export async function HEAD(req: NextApiRequest, res: NextApiResponse) {
//  console.log("HEAD: ", req.body);
//  return Response.json({ status: 200, message: "HEAD" });
//}
