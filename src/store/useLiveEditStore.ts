import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LiveEditState {
  isEditMode: boolean;
  activeElementId: string | null;
  texts: Record<string, string>;
  images: Record<string, string>;
  setEditMode: (mode: boolean) => void;
  toggleEditMode: () => void;
  setText: (id: string, value: string) => void;
  setImage: (id: string, url: string) => void;
  setActiveElementId: (id: string | null) => void;
  /** Loads DOM HTML into store then focuses editor — avoids empty modal / race when opening */
  beginEditElement: (id: string) => void;
}

export const useLiveEditStore = create<LiveEditState>()(
  persist(
    (set) => ({
      isEditMode: false,
      activeElementId: null,
      texts: {},
      images: {},
      setEditMode: (mode) => set({ isEditMode: mode, activeElementId: null }),
      toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode, activeElementId: null })),
      setText: (id, value) =>
        set((state) => ({
          texts: { ...state.texts, [id]: value },
        })),
      setImage: (id, url) =>
        set((state) => ({
          images: { ...state.images, [id]: url },
        })),
      setActiveElementId: (id) => set({ activeElementId: id }),
      beginEditElement: (id: string) =>
        set((state) => {
          let html = state.texts[id];
          if (html === undefined && typeof document !== "undefined") {
            const el = document.getElementById(id);
            html = el?.innerHTML ?? "";
          }
          if (html === undefined) html = "";
          return {
            texts: { ...state.texts, [id]: html },
            activeElementId: id,
          };
        }),
    }),
    {
      name: "kuboyako-live-edit-storage",
      partialize: (state) => ({ isEditMode: state.isEditMode, texts: state.texts, images: state.images }),
    }
  )
);
