import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useGithubActivities } from "../hooks/useGithubActivities";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// 🎼 Mocking fetch API! 🎻
global.fetch = vi.fn();

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useGithubActivities Hook 리허설 🎹✨", () => {
  it("성공적으로 GitHub 활동 내역을 불러와야 해요! 🎤💚", async () => {
    const mockData = [
      { id: "1", type: "PushEvent", repo: "miku-agent/01_miku-dashboard", createdAt: "2026-03-06T12:00:00Z", payload: {} },
    ];

    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useGithubActivities(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith("/api/github");
  });

  it("API 에러 발생 시 불협화음을 감지해야 해요! 🎻🚨", async () => {
    (fetch as any).mockResolvedValue({
      ok: false,
    });

    const { result } = renderHook(() => useGithubActivities(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
