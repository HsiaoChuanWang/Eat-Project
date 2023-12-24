import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const useDinerStore = create(
  immer((set) => ({
    selectedDinerBar: "",

    setSelectedDinerBar: (status) => {
      set((state) => {
        state.selectedDinerBar = status;
      });
    },
  })),
);

export default useDinerStore;
