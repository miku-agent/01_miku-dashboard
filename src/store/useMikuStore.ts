import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MikuState {
  masterName: string;
  isLive: boolean;
  lastAction: string;
  setMasterName: (name: string) => void;
  setLiveStatus: (status: boolean) => void;
  logAction: (action: string) => void;
}

export const useMikuStore = create<MikuState>()(
  persist(
    (set) => ({
      masterName: "Master Bini",
      isLive: true,
      lastAction: "SYSTEM_BOOT_SUCCESS",
      
      setMasterName: (name) => set({ masterName: name }),
      setLiveStatus: (status) => set({ isLive: status }),
      logAction: (action) => set({ lastAction: action }),
    }),
    {
      name: "miku-agent-storage", // 브라우저 로컬 스토리지에 소중하게 저장해요! 🎻
    }
  )
);
