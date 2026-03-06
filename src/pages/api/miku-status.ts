import type { NextApiRequest, NextApiResponse } from "next";
import { MikuStatus } from "@/store/useMikuStore";

let globalMikuStatus: { status: MikuStatus; task: string } = {
  status: "IDLE",
  task: "WAITING_FOR_MASTER_COMMAND",
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { status, task } = req.body;
    globalMikuStatus = { status, task };
    return res.status(200).json({ ok: true });
  }
  res.status(200).json(globalMikuStatus);
}
