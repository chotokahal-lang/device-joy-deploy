import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ElementTransform {
  scale?: number;
  rotation?: number;
  offsetX?: number;
  offsetY?: number;
  width?: number; // px override
}

interface Snapshot {
  texts: Record<string, string>;
  images: Record<string, string>;
  transforms: Record<string, ElementTransform>;
}

interface LiveEditState extends Snapshot {
  isEditMode: boolean;
  activeElementId: string | null;
  past: Snapshot[];
  future: Snapshot[];
  setEditMode: (mode: boolean) => void;
  toggleEditMode: () => void;
  setText: (id: string, value: string) => void;
  setImage: (id: string, url: string) => void;
  patchTransform: (id: string, patch: ElementTransform, commit?: boolean) => void;
  setScale: (id: string, value: number) => void;
  setRotation: (id: string, value: number) => void;
  resetElement: (id: string) => void;
  setActiveElementId: (id: string | null) => void;
  beginEditElement: (id: string) => void;
  undo: () => void;
  redo: () => void;
  commit: () => void;
}

const HISTORY_LIMIT = 50;

const snap = (s: Snapshot): Snapshot => ({
  texts: { ...s.texts },
  images: { ...s.images },
  transforms: { ...s.transforms },
});

export const useLiveEditStore = create<LiveEditState>()(
  persist(
    (set, get) => {
      const pushHistory = (state: LiveEditState): Pick<LiveEditState, "past" | "future"> => ({
        past: [...state.past, snap(state)].slice(-HISTORY_LIMIT),
        future: [],
      });

      return {
        isEditMode: false,
        activeElementId: null,
        texts: {},
        images: {},
        transforms: {},
        past: [],
        future: [],

        setEditMode: (mode) => set({ isEditMode: mode, activeElementId: null }),
        toggleEditMode: () => set((s) => ({ isEditMode: !s.isEditMode, activeElementId: null })),

        setText: (id, value) =>
          set((s) => ({ ...pushHistory(s), texts: { ...s.texts, [id]: value } })),

        setImage: (id, url) =>
          set((s) => ({ ...pushHistory(s), images: { ...s.images, [id]: url } })),

        patchTransform: (id, patch, commit = true) =>
          set((s) => {
            const current = s.transforms[id] ?? {};
            const next = { ...current, ...patch };
            return {
              ...(commit ? pushHistory(s) : {}),
              transforms: { ...s.transforms, [id]: next },
            };
          }),

        setScale: (id, value) =>
          set((s) => ({
            ...pushHistory(s),
            transforms: { ...s.transforms, [id]: { ...s.transforms[id], scale: value } },
          })),

        setRotation: (id, value) =>
          set((s) => ({
            ...pushHistory(s),
            transforms: { ...s.transforms, [id]: { ...s.transforms[id], rotation: value } },
          })),

        resetElement: (id) =>
          set((s) => {
            const { [id]: _t, ...transforms } = s.transforms;
            const { [id]: _i, ...images } = s.images;
            const { [id]: _tx, ...texts } = s.texts;
            return { ...pushHistory(s), transforms, images, texts };
          }),

        setActiveElementId: (id) => set({ activeElementId: id }),

        beginEditElement: (id) =>
          set((s) => {
            let html = s.texts[id];
            if (html === undefined && typeof document !== "undefined") {
              html = document.getElementById(id)?.innerHTML ?? "";
            }
            return {
              texts: { ...s.texts, [id]: html ?? "" },
              activeElementId: id,
            };
          }),

        commit: () => set((s) => pushHistory(s)),

        undo: () =>
          set((s) => {
            const prev = s.past[s.past.length - 1];
            if (!prev) return {};
            return {
              past: s.past.slice(0, -1),
              future: [snap(s), ...s.future].slice(0, HISTORY_LIMIT),
              texts: prev.texts,
              images: prev.images,
              transforms: prev.transforms,
            };
          }),

        redo: () =>
          set((s) => {
            const next = s.future[0];
            if (!next) return {};
            return {
              past: [...s.past, snap(s)].slice(-HISTORY_LIMIT),
              future: s.future.slice(1),
              texts: next.texts,
              images: next.images,
              transforms: next.transforms,
            };
          }),
      };
    },
    {
      name: "kuboyako-live-edit-storage",
      partialize: (state) => ({
        isEditMode: state.isEditMode,
        texts: state.texts,
        images: state.images,
        transforms: state.transforms,
      }),
    }
  )
);
