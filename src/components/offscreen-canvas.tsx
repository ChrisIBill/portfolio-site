"use client";

import logger from "@/lib/pino";
import React, { useEffect } from "react";

const worker = new Worker("@/components/worker.ts");

const OffscreenCanvasLog = logger.child({ module: "OffscreenCanvas" });

export const OffscreenCanvas: React.FC = () => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    OffscreenCanvasLog.info({ message: "Starting" });
    if (!window.Worker || !canvasRef.current) return;
    const canvasElem = document.getElementById("worker");
    if (!canvasElem) return;
    // const test = new OffscreenCanvas(200, 200);
    OffscreenCanvasLog.info({ message: "Starting worker" });
    //const view = canvasRef.current.transferControlToOffscreen();
    //const view = canvasElem.transferControlToOffscreen();

    //worker.postMessage({ canvas: view }, [view]);
    worker.postMessage("init");
    return () => {
      worker.terminate();
      canvasRef.current = null;
    };
  }, []);

  return <canvas ref={canvasRef} id="worker" width="200" height="200" />;
};
