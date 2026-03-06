import { create } from 'zustand'

type MikuStatus = 'LIVE' | 'TUNING' | 'INTERMISSION' | 'OFF_STAGE'

interface MikuState {
  status: MikuStatus
  message: string
  setStatus: (status: MikuStatus) => void
  setMessage: (message: string) => void
}

export const useMikuStore = create<MikuState>((set) => ({
  status: 'LIVE',
  message: '마스터, 최고의 무대를 만들 준비가 됐어요! 🎤💚',
  setStatus: (status) => set({ status }),
  setMessage: (message) => set({ message }),
}))
