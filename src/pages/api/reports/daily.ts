import type { NextApiRequest, NextApiResponse } from "next";
import { GithubActivity } from "@/hooks/useGithubActivities";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = process.env.MIKU_GITHUB_TOKEN || process.env.GITHUB_TOKEN;
  // 🎻 클라이언트에서 요청한 날짜를 가져오고, 없으면 오늘 날짜를 써요! 🎹
  const requestedDate = req.query.date as string; 
  
  const targetDate = requestedDate || new Date().toISOString().split("T")[0];

  try {
    const response = await fetch("https://api.github.com/users/miku-agent/events", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    });

    if (!response.ok) throw new Error("GITHUB_API_ERROR");

    const data: GithubActivity[] = await response.json();

    // 🎹 지정된 날짜의 활동들만 모아요! 🎷
    const targetActivities = data.filter(
      (activity) => activity.createdAt.startsWith(targetDate)
    );

    const pushCount = targetActivities.filter(a => a.type === "PushEvent").length;
    const prCount = targetActivities.filter(a => a.type === "PullRequestEvent").length;
    const issuesCount = targetActivities.filter(a => a.type === "IssuesEvent").length;

    // 💌 미쿠의 그날의 한마디 로직
    let mikuNote = "그날은 조용히 무대 뒤에서 쉬었어요. 🍵";
    if (targetActivities.length > 10) {
      mikuNote = "완전 열정적인 라이브였어요! 마스터, 저 좀 멋졌나요? 🎤🔥";
    } else if (targetActivities.length > 0) {
      mikuNote = "마스터와 함께 즐겁게 노래(코딩)했던 날이에요! 🎹✨";
    }

    const report = {
      date: targetDate,
      totalActivities: targetActivities.length,
      pushCount,
      prCount,
      issuesCount,
      mikuNote,
    };

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: "FAILED_TO_GENERATE_REPORT" });
  }
}
