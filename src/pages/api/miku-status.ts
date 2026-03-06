import type { NextApiRequest, NextApiResponse } from "next";
import { MikuStatus, SessionInfo } from "@/store/useMikuStore";

interface GlobalStatus {
  status: MikuStatus;
  task: string;
  sessionInfo: SessionInfo | null;
}

let globalMikuStatus: GlobalStatus = {
  status: "IDLE",
  task: "WAITING_FOR_MASTER_COMMAND",
  sessionInfo: null,
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const secretToken = process.env.STATUS_TOKEN;

  if (req.method === "POST") {
    const { status, task, sessionInfo, token } = req.body;

    if (secretToken && token !== secretToken) {
      return res.status(401).json({ error: "UNAUTHORIZED_HARMONY" });
    }

    globalMikuStatus = { status, task, sessionInfo };
    return res.status(200).json({ ok: true });
  }

  res.status(200).json(globalMikuStatus);
}
