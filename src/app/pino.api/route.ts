"use server";
//export const dynamic = 'force-dynamic'
import { NextApiRequest, NextApiResponse } from "next/types";
import fs, { accessSync, appendFileSync, constants } from "fs";
import logger from "@/lib/pino";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  console.log("GET: ", req.query);
  //const fs = require('fs')
  //const path = require('path')
  //const filePath = path.join(process.cwd(), 'pino.log')
  //const file = fs.readFileSync(filePath, 'utf8')
  //return res.status(200).json({ file })
  return res.status(200).json({ message: "GET" });
}

const PostLog = logger.child({ module: "Post" });
async function writeToFile(props: any) {
  try {
    const write = appendFileSync(
      props.path,
      JSON.stringify(props.request, null, "\n"),
    );
    write;
  } catch (err) {
    PostLog.error({
      message: "Error writing file",
      error: err,
      props,
    });
  }
}
export async function POST(req: NextApiRequest, res: NextApiResponse) {
  PostLog.debug({ message: "POST", body: req.body });
  const request = await req.json();
  const path = require("path");
  const outfilePath = path.join(process.cwd(), "pino.log.out.json");
  const clientPath = path.join(process.cwd(), "pino.log.client.json");
  const infoPath = path.join(process.cwd(), "pino.log.info.json");

  writeToFile({ path: outfilePath, request });
  writeToFile({ path: clientPath, request });
  writeToFile({ path: infoPath, request });
  return Response.json({ status: 200, message: "POST" });
}
export async function PUT(req: NextApiRequest, res: NextApiResponse) {
  console.log("PUT: ", req.body);
  return Response.json({ status: 200, message: "PUT" });
}
export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  console.log("DELETE: ", req.body);

  return Response.json({ status: 200, message: "DELETE" });
}
export async function PATCH(req: NextApiRequest, res: NextApiResponse) {
  console.log("PATCH: ", req.body);
  return Response.json({ status: 200, message: "PATCH" });
}
export async function OPTIONS(req: NextApiRequest, res: NextApiResponse) {
  console.log("OPTIONS: ", req.body);
  return Response.json({ status: 200, message: "OPTIONS" });
}
export async function HEAD(req: NextApiRequest, res: NextApiResponse) {
  console.log("HEAD: ", req.body);
  return Response.json({ status: 200, message: "HEAD" });
}
