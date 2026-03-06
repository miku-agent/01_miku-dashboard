import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useMikuStatusSync } from "../hooks/useMikuStatusSync";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMikuStore } from "../store/useMikuStore";
import React from "react";

global.fetch = vi.fn();

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useMikuStatusSync Hook 리허설 🧠✨", () => {
  it("서버의 미쿠 기분을 스토어에 잘 동기화해야 해요! 🎤💚", async () => {
    const mockStatus = { status: "SINGING", task: "CONCERT_IN_PROGRESS" };

    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockStatus,
    });

    renderHook(() => useMikuStatusSync(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      const state = useMikuStore.getState();
      expect(state.status).toBe("SINGING");
      expect(state.currentTask).toBe("CONCERT_IN_PROGRESS");
    });
  });
});
