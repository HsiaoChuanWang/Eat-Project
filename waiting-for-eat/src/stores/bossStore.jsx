import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const useBossStore = create(
  immer((set) => ({
    selected: "boss",

    setSelected: (status) => {
      set((state) => {
        state.selected = status;
      });
    },
  })),
);

export default useBossStore;
