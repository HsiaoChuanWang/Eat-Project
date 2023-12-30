import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const useHeaderStore = create(
  immer((set, get) => ({
    situation: "LogOut",

    setHeader: (status) => {
      set((state) => {
        state.situation = status;
      });
    },
  })),
);

export default useHeaderStore;
