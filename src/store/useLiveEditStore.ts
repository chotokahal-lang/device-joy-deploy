import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/integrations/supabase/client";

export interface ElementTransform {
  scale?: number;
  rotation?: number;
  offsetX?: number;
  offsetY?: number;
  width?: number;
}

interface Snapshot {
  texts: Record<string, string>;
  images: Record<string, string>;
  transforms: Record<string, ElementTransform>;
}

interface LiveEditState extends Snapshot {
  isEditMode: boolean;
  unlocked: boolean;
  activeElementId: string | null;
  selectedIds: string[];
  snapEnabled: boolean;
  gridSize: number;
  past: Snapshot[];
  future: Snapshot[];
  cloudSyncEnabled: boolean;
  setUnlocked: (v: boolean) => void;
  setEditMode: (mode: boolean) => void;
  toggleEditMode: () => void;
  setText: (id: string, value: string) => void;
  setImage: (id: string, url: string) => void;
  patchTransform: (id: string, patch: ElementTransform, commit?: boolean) => void;
  patchTransformMany: (ids: string[], patch: ElementTransform, commit?: boolean) => void;
  setScale: (id: string, value: number) => void;
  setRotation: (id: string, value: number) => void;
  resetElement: (id: string) => void;
  setActiveElementId: (id: string | null) => void;
  toggleSelect: (id: string) => void;
  clearSelection: () => void;
  beginEditElement: (id: string) => void;
  toggleSnap: () => void;
  setGridSize: (n: number) => void;
  setCloudSync: (v: boolean) => void;
  hydrateFromCloud: () => Promise<void>;
  pushToCloud: () => Promise<void>;
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

const snapValue = (v: number, grid: number) => Math.round(v / grid) * grid;
const applySnap = (patch: ElementTransform, snapEnabled: boolean, grid: number): ElementTransform => {
  if (!snapEnabled) return patch;
  const next = { ...patch };
  if (typeof next.offsetX === "number") next.offsetX = snapValue(next.offsetX, grid);
  if (typeof next.offsetY === "number") next.offsetY = snapValue(next.offsetY, grid);
  if (typeof next.width === "number") next.width = snapValue(next.width, grid);
  return next;
};

let pushTimer: ReturnType<typeof setTimeout> | null = null;
const schedulePush = (fn: () => void) => {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(fn, 600);
};

export const useLiveEditStore = create<LiveEditState>()(
  persist(
    (set, get) => {
      const pushHistory = (state: LiveEditState): Pick<LiveEditState, "past" | "future"> => ({
        past: [...state.past, snap(state)].slice(-HISTORY_LIMIT),
        future: [],
      });

      const queueCloud = () => {
        if (!get().cloudSyncEnabled) return;
        schedulePush(() => void get().pushToCloud());
      };

      return {
        isEditMode: false,
        unlocked: false,
        activeElementId: null,
        selectedIds: [],
        snapEnabled: false,
        gridSize: 8,
        cloudSyncEnabled: false,
        texts: {},
        images: {},
        transforms: {},
        past: [],
        future: [],

        setUnlocked: (v) => set({ unlocked: v }),
        setEditMode: (mode) => set({ isEditMode: mode, activeElementId: null, selectedIds: [] }),
        toggleEditMode: () => set((s) => ({ isEditMode: !s.isEditMode, activeElementId: null, selectedIds: [] })),

        setText: (id, value) => {
          set((s) => ({ ...pushHistory(s), texts: { ...s.texts, [id]: value } }));
          queueCloud();
        },

        setImage: (id, url) => {
          set((s) => ({ ...pushHistory(s), images: { ...s.images, [id]: url } }));
          queueCloud();
        },

        patchTransform: (id, patch, commit = true) =>
          set((s) => {
            const finalPatch = applySnap(patch, s.snapEnabled, s.gridSize);
            const current = s.transforms[id] ?? {};
            const next = { ...current, ...finalPatch };
            if (commit) queueCloud();
            return {
              ...(commit ? pushHistory(s) : {}),
              transforms: { ...s.transforms, [id]: next },
            };
          }),

        patchTransformMany: (ids, patch, commit = true) =>
          set((s) => {
            const finalPatch = applySnap(patch, s.snapEnabled, s.gridSize);
            const transforms = { ...s.transforms };
            for (const id of ids) {
              const cur = transforms[id] ?? {};
              transforms[id] = { ...cur, ...finalPatch };
            }
            if (commit) queueCloud();
            return { ...(commit ? pushHistory(s) : {}), transforms };
          }),

        setScale: (id, value) => {
          set((s) => ({
            ...pushHistory(s),
            transforms: { ...s.transforms, [id]: { ...s.transforms[id], scale: value } },
          }));
          queueCloud();
        },

        setRotation: (id, value) => {
          set((s) => ({
            ...pushHistory(s),
            transforms: { ...s.transforms, [id]: { ...s.transforms[id], rotation: value } },
          }));
          queueCloud();
        },

        resetElement: (id) => {
          set((s) => {
            const { [id]: _t, ...transforms } = s.transforms;
            const { [id]: _i, ...images } = s.images;
            const { [id]: _tx, ...texts } = s.texts;
            return { ...pushHistory(s), transforms, images, texts };
          });
          queueCloud();
        },

        setActiveElementId: (id) =>
          set((s) => ({
            activeElementId: id,
            selectedIds: id ? (s.selectedIds.includes(id) ? s.selectedIds : [id]) : [],
          })),

        toggleSelect: (id) =>
          set((s) => {
            const exists = s.selectedIds.includes(id);
            const selectedIds = exists ? s.selectedIds.filter((x) => x !== id) : [...s.selectedIds, id];
            // Multi-select mode: do not open editor modal; clear active so toolbar stays hidden
            const activeElementId = selectedIds.length > 1 ? null : selectedIds[0] ?? null;
            return { selectedIds, activeElementId };
          }),

        clearSelection: () => set({ selectedIds: [], activeElementId: null }),

        beginEditElement: (id) =>
          set((s) => {
            let html = s.texts[id];
            if (html === undefined && typeof document !== "undefined") {
              html = document.getElementById(id)?.innerHTML ?? "";
            }
            return {
              texts: { ...s.texts, [id]: html ?? "" },
              activeElementId: id,
              selectedIds: [id],
            };
          }),

        toggleSnap: () => set((s) => ({ snapEnabled: !s.snapEnabled })),
        setGridSize: (n) => set({ gridSize: Math.max(2, n) }),
        setCloudSync: (v) => {
          set({ cloudSyncEnabled: v });
          if (v) void get().hydrateFromCloud();
        },

        hydrateFromCloud: async () => {
          try {
            const { data } = await supabase
              .from("live_edit_state")
              .select("texts, images, transforms")
              .eq("scope", "global")
              .maybeSingle();
            if (!data) return;
            set({
              texts: (data.texts as any) ?? {},
              images: (data.images as any) ?? {},
              transforms: (data.transforms as any) ?? {},
            });
          } catch (err) {
            console.warn("[live-edit] hydrate failed", err);
          }
        },

        pushToCloud: async () => {
          try {
            const { data: auth } = await supabase.auth.getUser();
            const { texts, images, transforms } = get();
            await supabase
              .from("live_edit_state")
              .update({ texts: texts as any, images: images as any, transforms: transforms as any, updated_by: auth.user?.id ?? null })
              .eq("scope", "global");
          } catch (err) {
            console.warn("[live-edit] push failed", err);
          }
        },

        commit: () => {
          set((s) => pushHistory(s));
          queueCloud();
        },

        undo: () =>
          set((s) => {
            const prev = s.past[s.past.length - 1];
            if (!prev) return {};
            queueCloud();
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
            queueCloud();
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
        unlocked: state.unlocked,
        snapEnabled: state.snapEnabled,
        gridSize: state.gridSize,
        cloudSyncEnabled: state.cloudSyncEnabled,
        texts: state.texts,
        images: state.images,
        transforms: state.transforms,
      }),
    }
  )
);

// realtime sync from cloud
if (typeof window !== "undefined") {
  try {
    supabase
      .channel("live-edit-sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "live_edit_state" },
        (payload: any) => {
          const row = payload.new ?? payload.record;
          if (!row || row.scope !== "global") return;
          // Only apply if cloud sync enabled (avoid clobbering local-only edits)
          const s = useLiveEditStore.getState();
          if (!s.cloudSyncEnabled) return;
          useLiveEditStore.setState({
            texts: row.texts ?? {},
            images: row.images ?? {},
            transforms: row.transforms ?? {},
          });
        }
      )
      .subscribe();
  } catch {}
}
