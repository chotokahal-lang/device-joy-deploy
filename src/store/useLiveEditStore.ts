import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LiveEditState {
  isEditMode: boolean;
  activeElementId: string | null;
  texts: Record<string, string>;
  images: Record<string, string>;
  scales: Record<string, number>;
  rotations: Record<string, number>;
  setEditMode: (mode: boolean) => void;
  toggleEditMode: () => void;
  setText: (id: string, value: string) => void;
  setImage: (id: string, url: string) => void;
  setScale: (id: string, value: number) => void;
  setRotation: (id: string, value: number) => void;
  resetElement: (id: string) => void;
  setActiveElementId: (id: string | null) => void;
  beginEditElement: (id: string) => void;
}

export const useLiveEditStore = create<LiveEditState>()(
  persist(
    (set) => ({
      isEditMode: false,
      activeElementId: null,
      texts: {},
      images: {},
      scales: {},
      rotations: {},
      setEditMode: (mode) => set({ isEditMode: mode, activeElementId: null }),
      toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode, activeElementId: null })),
      setText: (id, value) => set((state) => ({ texts: { ...state.texts, [id]: value } })),
      setImage: (id, url) => set((state) => ({ images: { ...state.images, [id]: url } })),
      setScale: (id, value) => set((state) => ({ scales: { ...state.scales, [id]: value } })),
      setRotation: (id, value) => set((state) => ({ rotations: { ...state.rotations, [id]: value } })),
      resetElement: (id) =>
        set((state) => {
          const { [id]: _s, ...scales } = state.scales;
          const { [id]: _r, ...rotations } = state.rotations;
          const { [id]: _i, ...images } = state.images;
          const { [id]: _t, ...texts } = state.texts;
          return { scales, rotations, images, texts };
        }),
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
      partialize: (state) => ({
        isEditMode: state.isEditMode,
        texts: state.texts,
        images: state.images,
        scales: state.scales,
        rotations: state.rotations,
      }),
    }
  )
);
