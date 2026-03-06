import type { NextApiRequest, NextApiResponse } from "next";
import { MikuStatus, SessionInfo } from "@/store/useMikuStore";
import { getRedis } from "@/lib/redis";

interface StoredStatus {
  status: MikuStatus;
  task: string;
  sessionInfo: SessionInfo | null;
  updatedAt: string;
}

const REDIS_KEY = "miku:status";

const fallback: StoredStatus = {
  status: "IDLE",
  task: "WAITING_FOR_MASTER_COMMAND",
  sessionInfo: null,
  updatedAt: new Date(0).toISOString(),
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const secretToken = process.env.STATUS_TOKEN;

  try {
    const redis = await getRedis();

    if (req.method === "POST") {
      const { status, task, sessionInfo, token } = req.body as {
        status: MikuStatus;
        task: string;
        sessionInfo: SessionInfo | null;
        token?: string;
      };

      if (secretToken && token !== secretToken) {
        return res.status(401).json({ error: "UNAUTHORIZED_HARMONY" });
      }

      const payload: StoredStatus = {
        status,
        task,
        sessionInfo: sessionInfo ?? null,
        updatedAt: new Date().toISOString(),
      };

      await redis.set(REDIS_KEY, JSON.stringify(payload));
      return res.status(200).json({ ok: true });
    }

    const raw = await redis.get(REDIS_KEY);
    if (!raw) return res.status(200).json(fallback);

    return res.status(200).json(JSON.parse(raw) as StoredStatus);
  } catch {
    // Redis가 꺼져 있거나 연결 실패 시, 최소한의 응답
    return res.status(200).json(fallback);
  }
}
