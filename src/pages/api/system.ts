import type { NextApiRequest, NextApiResponse } from "next";
import os from "os";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memUsage = (usedMem / totalMem) * 100;
  const cpuLoad = (os.loadavg()[0] / os.cpus().length) * 100;

  res.status(200).json({
    cpu: Math.min(cpuLoad, 100).toFixed(1),
    memory: memUsage.toFixed(1),
    totalMem: (totalMem / (1024 * 1024 * 1024)).toFixed(1) + "GB",
    usedMem: (usedMem / (1024 * 1024 * 1024)).toFixed(1) + "GB",
    uptime: os.uptime(),
    platform: os.platform(),
  });
}
