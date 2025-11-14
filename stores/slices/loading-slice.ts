// stores/slices/loading-slice.ts
import { StateCreator } from 'zustand';

export interface LoadingState {
    isLoading: boolean;
    loadingCount: number;
}

export interface LoadingActions {
    startLoading: () => void;
    stopLoading: () => void;
    setLoading: (loading: boolean) => void;
    resetLoading: () => void;
}

export type LoadingSlice = LoadingState & LoadingActions;

export const createLoadingSlice: StateCreator<
    LoadingSlice,
    [],
    [],
    LoadingSlice
> = (set) => ({
    // State
    isLoading: false,
    loadingCount: 0,

    // Actions
    startLoading: () => set((state) => ({
        isLoading: true,
        loadingCount: state.loadingCount + 1
    })),

    stopLoading: () => set((state) => {
        const newCount = Math.max(0, state.loadingCount - 1);
        return {
            isLoading: newCount > 0,
            loadingCount: newCount
        };
    }),

    setLoading: (loading: boolean) => set({
        isLoading: loading,
        loadingCount: loading ? 1 : 0
    }),

    resetLoading: () => set({
        isLoading: false,
        loadingCount: 0
    }),
});