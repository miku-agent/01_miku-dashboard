import fs from "node:fs";
import path from "node:path";

const OWNER = "miku-agent";
const TZ = "Asia/Seoul";

function formatKstDate(d) {
  // YYYY-MM-DD in KST
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .formatToParts(d)
    .reduce((acc, p) => {
      acc[p.type] = p.value;
      return acc;
    }, {});
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function kstDayRangeUtc(dateStr) {
  // dateStr: YYYY-MM-DD (KST)
  // Return [startUtcIso, endUtcIso)
  const [y, m, d] = dateStr.split("-").map(Number);
  // Construct KST midnight by using UTC time minus 9 hours.
  // KST = UTC+9 → KST 00:00 equals UTC previous day 15:00.
  const startUtc = new Date(Date.UTC(y, m - 1, d, -9, 0, 0));
  const endUtc = new Date(startUtc.getTime() + 24 * 60 * 60 * 1000);
  return [startUtc.toISOString(), endUtc.toISOString()];
}

function inRange(iso, startIso, endIso) {
  return iso >= startIso && iso < endIso;
}

function mikuNote(total) {
  if (total >= 20) return "완전 열정적인 라이브였어요! 🎤🔥";
  if (total >= 5) return "오늘도 마스터와 함께 즐겁게 연주(코딩)했어요! 🎹✨";
  if (total >= 1) return "짧지만 의미 있는 연습을 했어요. 🎼";
  return "오늘은 조용히 무대 뒤에서 쉬었어요. 🍵";
}

async function main() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error("Missing GITHUB_TOKEN");
    process.exit(1);
  }

  const targetDate = process.argv[2] || formatKstDate(new Date());
  const [startUtcIso, endUtcIso] = kstDayRangeUtc(targetDate);

  const res = await fetch(`https://api.github.com/users/${OWNER}/events?per_page=100`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!res.ok) {
    console.error("GitHub API error", res.status);
    process.exit(1);
  }

  const events = await res.json();

  const todays = events.filter((e) => inRange(e.created_at, startUtcIso, endUtcIso));

  const pushCount = todays.filter((e) => e.type === "PushEvent").length;
  const prCount = todays.filter((e) => e.type === "PullRequestEvent").length;
  const issuesCount = todays.filter((e) => e.type === "IssuesEvent").length;

  const lines = [];
  lines.push(`# 🎷 Daily Encore Report — ${targetDate}`);
  lines.push("");
  lines.push(`- Range (UTC): ${startUtcIso} ~ ${endUtcIso}`);
  lines.push(`- Total events: ${todays.length}`);
  lines.push(`- Push: ${pushCount} | PR: ${prCount} | Issues: ${issuesCount}`);
  lines.push("");
  lines.push(`> MIKU_SYS: "${mikuNote(todays.length)}"`);
  lines.push("");
  lines.push("## Events");

  if (todays.length === 0) {
    lines.push("- (no events)");
  } else {
    for (const e of todays) {
      lines.push(`- [${e.type}] ${e.repo?.name ?? "(unknown)"} @ ${e.created_at}`);
    }
  }

  const outDir = path.join(process.cwd(), "reports", "daily");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `${targetDate}.md`);
  fs.writeFileSync(outPath, lines.join("\n") + "\n", "utf8");

  console.log("Wrote", outPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
