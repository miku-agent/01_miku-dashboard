import type { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { getRedis } from "@/lib/redis";

const REDIS_KEY = "miku:status";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memUsage = (usedMem / totalMem) * 100;
  const cpuLoad = (os.loadavg()[0] / os.cpus().length) * 100;

  let mikuStatus: any = null;
  try {
    const redis = await getRedis();
    const raw = await redis.get(REDIS_KEY);
    mikuStatus = raw ? JSON.parse(raw) : null;
  } catch {
    mikuStatus = null;
  }

  res.status(200).json({
    cpu: Math.min(cpuLoad, 100).toFixed(1),
    memory: memUsage.toFixed(1),
    totalMem: (totalMem / (1024 * 1024 * 1024)).toFixed(1) + "GB",
    usedMem: (usedMem / (1024 * 1024 * 1024)).toFixed(1) + "GB",
    uptime: os.uptime(),
    platform: os.platform(),
    mikuStatus,
  });
}
