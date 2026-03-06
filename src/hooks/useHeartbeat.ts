import { useQuery } from "@tanstack/react-query";
import type { HeartbeatResponse } from "@/pages/api/heartbeat";

export const useHeartbeat = () => {
  return useQuery<HeartbeatResponse>({
    queryKey: ["heartbeat"],
    queryFn: async () => {
      const response = await fetch("/api/heartbeat");
      if (!response.ok) throw new Error("HEARTBEAT_CHECK_FAILED");
      return response.json();
    },
    refetchInterval: 30000, // 30s interval per HEARTBEAT.md spec
  });
};
