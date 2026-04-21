import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAppStore = create(
  persist(
    (set, get) => ({
      // Current result
      currentResult: null,
      currentIdea: '',

      // Version history (saved architectures)
      versions: [],

      // Dark mode
      darkMode: false,

      // Active theme color
      colorTheme: 'blue', // blue, emerald, rose, purple

      // Collaboration: share ID
      shareId: null,

      setCurrentResult: (result, idea) => {
        set({ currentResult: result, currentIdea: idea });
        // Auto-save version
        const versions = get().versions;
        const newVersion = {
          id: Date.now().toString(),
          idea,
          result,
          timestamp: new Date().toISOString(),
          label: `v${versions.length + 1}`,
        };
        set({ versions: [newVersion, ...versions].slice(0, 20) });
      },

      deleteVersion: (id) => {
        set({ versions: get().versions.filter(v => v.id !== id) });
      },

      renameVersion: (id, label) => {
        set({
          versions: get().versions.map(v => v.id === id ? { ...v, label } : v),
        });
      },

      toggleDarkMode: () => set(s => ({ darkMode: !s.darkMode })),

      setColorTheme: (theme) => set({ colorTheme: theme }),

      setShareId: (id) => set({ shareId: id }),
    }),
    {
      name: 'arch-generator-store',
      partialize: (state) => ({
        versions: state.versions,
        darkMode: state.darkMode,
        colorTheme: state.colorTheme,
      }),
    }
  )
);

export default useAppStore;
