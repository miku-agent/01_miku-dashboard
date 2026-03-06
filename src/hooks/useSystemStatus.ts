import { useQuery } from "@tanstack/react-query";

export interface SystemStatus {
  cpu: string;
  memory: string;
  totalMem: string;
  usedMem: string;
  uptime: number;
  platform: string;
}

export const useSystemStatus = () => {
  return useQuery<SystemStatus>({
    queryKey: ["system-status"],
    queryFn: async () => {
      const response = await fetch("/api/system");
      if (!response.ok) {
        throw new Error("FAILED_TO_FETCH_SYSTEM_STATUS");
      }
      return response.json();
    },
    refetchInterval: 2000, // 🎻 2초마다 시스템의 숨소리를 체크해요! 🎹
  });
};
