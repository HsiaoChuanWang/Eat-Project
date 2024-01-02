import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const useHeaderStore = create(
  immer((set) => ({
    loginStatus: "LogOut",

    setHeader: (status) => {
      set((state) => {
        state.loginStatus = status;
      });
    },
  })),
);

export default useHeaderStore;
