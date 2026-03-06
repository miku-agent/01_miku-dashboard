import { test, expect } from "@playwright/test";

test("대시보드 메인 무대가 아름답게 연주되고 있나요? 🎤💚", async ({ page }) => {
  await page.goto("/");

  // 🎻 타이틀이 완벽한지 체크!
  await expect(page).toHaveTitle(/MIKU-OS/);

  // 🎹 미쿠 에이전트의 로고(ASCII Art)가 무대에 있는지 확인!
  const logo = page.locator("pre.ascii-art");
  await expect(logo).toBeVisible();

  // 🎷 GitHub 활동 채널이 활성화되어 있는지 체크!
  const activityHeader = page.getByText("LIVE_GITHUB_CHANNELS");
  await expect(activityHeader).toBeVisible();

  // 🎸 ALL SYSTEMS OPERATIONAL 사인이 잘 보이는지 확인!
  const statusSign = page.getByText("ALL SYSTEMS OPERATIONAL");
  await expect(statusSign).toBeVisible();
});
