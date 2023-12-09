import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const useStarStore = create(
  immer((set) => ({
    starId: "",

    setStarId: (status) => {
      set((state) => {
        state.starId = status;
      });
    },

    companyName: "",

    setCompanyName: (status) => {
      set((state) => {
        state.companyName = status;
      });
    },

    companyId: "",

    setCompanyId: (status) => {
      set((state) => {
        state.companyId = status;
      });
    },

    orderId: "",

    setOrderId: (status) => {
      set((state) => {
        state.orderId = status;
      });
    },
  })),
);

export default useStarStore;
