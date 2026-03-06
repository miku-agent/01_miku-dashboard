import { useQuery } from "@tanstack/react-query";

export interface GithubActivity {
  id: string;
  type: string;
  repo: string;
  createdAt: string;
  payload: any;
}

export const useGithubActivities = () => {
  return useQuery<GithubActivity[]>({
    queryKey: ["github-activities"],
    queryFn: async () => {
      const response = await fetch("/api/github");
      if (!response.ok) {
        throw new Error("FAILED_TO_FETCH_GITHUB_ACTIVITIES");
      }
      return response.json();
    },
    refetchInterval: 60000, // 🎻 1분마다 무대를 새롭게 갱신해요! 🎹
  });
};
