import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserResponseDto } from '@/models/generated';

interface AuthStore {
  user: UserResponseDto | null;
  accessToken: string | null;
  refreshToken: string | null;
  setUser: (user: UserResponseDto) => void;
  setAuth: (accessToken: string, refreshToken?: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setUser: (user: UserResponseDto) => set({ user }),
      setAuth: (accessToken: string, refreshToken?: string) =>
        set((state) => ({
          accessToken,
          refreshToken: refreshToken ?? state.refreshToken,
        })),
      clearAuth: () => set({ user: null, accessToken: null, refreshToken: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    },
  ),
);
