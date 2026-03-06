import { useQuery } from "@tanstack/react-query";

export interface DailyReport {
  date: string;
  totalActivities: number;
  pushCount: number;
  prCount: number;
  issuesCount: number;
  mikuNote: string;
}

export const useDailyReport = (targetDate?: string) => {
  return useQuery<DailyReport>({
    // 🎻 날짜가 바뀌면 캐시 키도 바뀌어서 새로 연주(Fetch)해요! 🎹
    queryKey: ["daily-report", targetDate || "today"],
    queryFn: async () => {
      const url = targetDate ? `/api/reports/daily?date=${targetDate}` : "/api/reports/daily";
      const response = await fetch(url);
      if (!response.ok) throw new Error("FAILED_TO_FETCH_DAILY_REPORT");
      return response.json();
    },
    refetchInterval: 300000,
  });
};
