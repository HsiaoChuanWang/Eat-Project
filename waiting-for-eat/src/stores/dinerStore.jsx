import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const useDinerStore = create(
  immer((set) => ({
    active: "diner",

    setActive: (status) => {
      set((state) => {
        state.situation = status;
      });
    },
  })),
);

export default useDinerStore;
