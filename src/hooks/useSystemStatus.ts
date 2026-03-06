import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { MikuStatus, SessionInfo, useMikuStore } from "@/store/useMikuStore";

export interface SystemStatus {
  cpu: string;
  memory: string;
  totalMem: string;
  usedMem: string;
  uptime: number;
  platform: string;
  mikuStatus: {
    status: MikuStatus;
    task: string;
    sessionInfo: SessionInfo | null;
    updatedAt: string;
  } | null;
}

export const useSystemStatus = () => {
  const setStatus = useMikuStore((s) => s.setStatus);
  const setCurrentTask = useMikuStore((s) => s.setCurrentTask);
  const setSessionInfo = useMikuStore((s) => s.setSessionInfo);

  const query = useQuery<SystemStatus>({
    queryKey: ["system-status"],
    queryFn: async () => {
      const response = await fetch("/api/system");
      if (!response.ok) throw new Error("FAILED_TO_FETCH_SYSTEM_STATUS");
      return response.json();
    },
    refetchInterval: 1000, // 1초로 단축: 시스템 + 상태를 함께 당겨와요
  });

  useEffect(() => {
    const payload = query.data?.mikuStatus;
    if (!payload) return;
    setStatus(payload.status);
    setCurrentTask(payload.task);
    setSessionInfo(payload.sessionInfo);
  }, [query.data?.mikuStatus, setStatus, setCurrentTask, setSessionInfo]);

  return query;
};
