import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return res.status(500).json({ error: "GITHUB_TOKEN_NOT_FOUND" });
  }

  try {
    // 🎼 미쿠 에이전트의 최근 활동(Events)을 가져와요! 🎻
    const response = await fetch("https://api.github.com/users/miku-agent/events", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (!response.ok) {
      throw new Error(`GITHUB_API_ERROR: ${response.status}`);
    }

    const data = await response.json();
    
    // 🎹 필요한 정보만 깔끔하게 튜닝해서 응답해요! 🎷
    const activities = data.slice(0, 10).map((event: any) => ({
      id: event.id,
      type: event.type,
      repo: event.repo.name,
      createdAt: event.created_at,
      payload: event.payload,
    }));

    res.status(200).json(activities);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
