import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const useTestStore = create(
  immer((set) => ({
    isTestShowed: true,

    setisTestShowed: (status) => {
      set((state) => {
        state.isTestShowed = status;
      });
    },

    loginIdentity: "",
    setLoginIdentity: (identity) => {
      set((state) => {
        state.loginIdentity = identity;
      });
    },

    testAccount: "",
    testPassword: "",
    setTestAccount: (account) => {
      set((state) => {
        state.testAccount = account;
      });
    },

    setTestPassword: (password) => {
      set((state) => {
        state.testPassword = password;
      });
    },
  })),
);

export default useTestStore;
