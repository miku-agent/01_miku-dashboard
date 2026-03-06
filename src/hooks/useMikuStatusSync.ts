import { useQuery } from "@tanstack/react-query";
import { MikuStatus, useMikuStore } from "@/store/useMikuStore";
import { useEffect } from "react";

export const useMikuStatusSync = () => {
  const setStatus = useMikuStore((state) => state.setStatus);
  const setCurrentTask = useMikuStore((state) => state.setCurrentTask);

  const query = useQuery<{ status: MikuStatus; task: string }>({
    queryKey: ["miku-live-status"],
    queryFn: async () => {
      const response = await fetch("/api/miku-status");
      if (!response.ok) throw new Error("FAILED_TO_FETCH_MIKU_STATUS");
      return response.json();
    },
    refetchInterval: 1000,
  });

  useEffect(() => {
    if (query.data) {
      setStatus(query.data.status);
      setCurrentTask(query.data.task);
    }
  }, [query.data, setStatus, setCurrentTask]);

  return query;
};
