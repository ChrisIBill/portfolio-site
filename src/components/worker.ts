"use client";
import logger from "@/lib/pino";

const WorkerLog = logger.child({ module: "worker" });
let canvas: HTMLCanvasElement | null = null;
let ctxWorker: CanvasRenderingContext2D | null = null;

self.onmessage = (event) => {
  WorkerLog.debug({ message: "onmessage of web worker", event });
  switch (event.data) {
    case "init":
      WorkerLog.debug({ message: "init of web worker", event });
      break;
    default:
      WorkerLog.debug({ message: "default of web worker", event });
      canvas = event.data.canvas;
      if (!canvas) return;
      ctxWorker = canvas.getContext("2d");
      startCounting();
      break;
  }
};

let counter = 0;
function startCounting() {
  setInterval(() => {
    redrawCanvas();
    counter++;
  }, 1000);
}

function redrawCanvas() {
  if (!canvas || !ctxWorker) return;
  WorkerLog.debug({ message: "redrawCanvas of web worker" });
  ctxWorker.clearRect(0, 0, canvas.width, canvas.height);
  ctxWorker.font = "24px Verdana";
  ctxWorker.textAlign = "center";
  ctxWorker.fillText(counter + "", canvas.width / 2, canvas.height / 2);
}
