import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const useBossStore = create(
  immer((set) => ({
    selectedBossBar: "",

    setSelectedBossBar: (status) => {
      set((state) => {
        state.selectedBossBar = status;
      });
    },
  })),
);

export default useBossStore;
