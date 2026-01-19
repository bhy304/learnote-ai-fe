import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserResponseDto } from '@/models/generated';

interface AuthStore {
  user: UserResponseDto | null;
  accessToken: string | null;
  refreshToken: string | null;
  hasNotes: boolean; // 사용자가 노트를 보유하고 있는지 여부 (스켈레톤 노출 결정용)
  setUser: (user: UserResponseDto) => void;
  setAuth: (accessToken: string, refreshToken?: string) => void;
  setHasNotes: (hasNotes: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      hasNotes: false,
      setUser: (user: UserResponseDto) => set({ user }),
      setAuth: (accessToken: string, refreshToken?: string) =>
        set((state) => ({
          accessToken,
          refreshToken: refreshToken ?? state.refreshToken,
        })),
      setHasNotes: (hasNotes: boolean) => set({ hasNotes }),
      clearAuth: () => set({ user: null, accessToken: null, refreshToken: null, hasNotes: false }),
    }),
    {
      name: 'auth-storage',
    },
  ),
);
