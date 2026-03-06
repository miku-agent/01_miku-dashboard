import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useSystemStatus } from "../hooks/useSystemStatus";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

global.fetch = vi.fn();

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useSystemStatus Hook 리허설 🎹✨", () => {
  it("실시간 시스템 상태를 아름답게 불러와야 해요! 🎤💚", async () => {
    const mockData = {
      cpu: "1.5",
      memory: "45.0",
      totalMem: "24.0GB",
      usedMem: "10.8GB",
      uptime: 10000,
      platform: "darwin",
      mikuStatus: null,
    };

    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useSystemStatus(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });
});
