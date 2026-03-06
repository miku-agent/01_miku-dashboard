import { create } from "zustand";
import { persist } from "zustand/middleware";

export type MikuStatus = "IDLE" | "THINKING" | "WORKING" | "SINGING" | "ERROR";

export interface SessionInfo {
  model: string;
  tokensIn: string;
  tokensOut: string;
  contextUsage: string;
  runtime: string;
}

interface MikuState {
  masterName: string;
  isLive: boolean;
  status: MikuStatus;
  currentTask: string;
  sessionInfo: SessionInfo | null;
  
  setMasterName: (name: string) => void;
  setLiveStatus: (status: boolean) => void;
  setStatus: (status: MikuStatus) => void;
  setCurrentTask: (task: string) => void;
  setSessionInfo: (info: SessionInfo | null) => void;
  logAction: (action: string) => void;
}

export const useMikuStore = create<MikuState>()(
  persist(
    (set) => ({
      masterName: "Master Bini",
      isLive: true,
      status: "IDLE",
      currentTask: "WAITING_FOR_MASTER_COMMAND",
      sessionInfo: null,
      
      setMasterName: (name) => set({ masterName: name }),
      setLiveStatus: (status) => set({ isLive: status }),
      setStatus: (status) => set({ status: status }),
      setCurrentTask: (task) => set({ currentTask: task }),
      setSessionInfo: (info) => set({ sessionInfo: info }),
      logAction: (action) => set({ currentTask: action }),
    }),
    {
      name: "miku-agent-storage",
    }
  )
);
