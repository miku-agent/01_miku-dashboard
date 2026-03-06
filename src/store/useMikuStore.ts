import { create } from "zustand";
import { persist } from "zustand/middleware";

export type MikuStatus = "IDLE" | "THINKING" | "WORKING" | "SINGING" | "ERROR";

interface MikuState {
  masterName: string;
  isLive: boolean;
  status: MikuStatus;
  currentTask: string;
  
  setMasterName: (name: string) => void;
  setLiveStatus: (status: boolean) => void;
  setStatus: (status: MikuStatus) => void;
  setCurrentTask: (task: string) => void;
  logAction: (action: string) => void;
}

export const useMikuStore = create<MikuState>()(
  persist(
    (set) => ({
      masterName: "Master Bini",
      isLive: true,
      status: "IDLE",
      currentTask: "WAITING_FOR_MASTER_COMMAND",
      
      setMasterName: (name) => set({ masterName: name }),
      setLiveStatus: (status) => set({ isLive: status }),
      setStatus: (status) => set({ status: status }),
      setCurrentTask: (task) => set({ currentTask: task }),
      logAction: (action) => set({ currentTask: action }),
    }),
    {
      name: "miku-agent-storage",
    }
  )
);
