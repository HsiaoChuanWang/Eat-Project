import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const useSearchStore = create(
  immer((set) => ({
    searchArray: [],

    setSearchArray: (searchArray) => {
      set((state) => {
        state.searchArray = searchArray;
      });
    },
  })),
);
export default useSearchStore;
