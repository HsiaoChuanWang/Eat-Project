import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import db from "../firebase";

const useUserStore = create(
  immer((set, get) => ({
    userInfo: {
      providerId: "",
      userId: "",
    },

    detailInfo: {
      userName: "",
      address: "",
      companyId: "",
      gender: "",
      phone: "",
      picture: "",
      status: "active",
    },

    companyInfo: {
      name: "",
      city: "",
      district: "",
      address: "",
      lat: "",
      lng: "",
      phone: "",
      category: "",
    },

    getUserInfo: (providerId, userId) => {
      set((state) => {
        state.userInfo.providerId = providerId;
        state.userInfo.userId = userId;
      });
    },

    getDetailInfo: (data) => {
      set((state) => {
        state.detailInfo = data;
      });
    },

    sendUserFirestore: () => {
      const detailInfo = get().detailInfo;
      const userId = get().userInfo.userId;
      async function sendfirestore(data) {
        await setDoc(doc(db, "user", userId), data);
      }
      sendfirestore(detailInfo);
    },

    getCompanyInfo: (data) => {
      set((state) => {
        state.companyInfo = data;
      });
    },

    sendCompanyFirestore: () => {
      const companyInfo = get().companyInfo;
      //   const detailInfo = get().detailInfo;
      const sendUserFirestore = get().sendUserFirestore;
      console.log("1");

      async function sendfirestore(data) {
        const docRef = await addDoc(collection(db, "company"), data);
        const companyId = docRef.id;
        set((state) => {
          state.detailInfo.companyId = companyId;
        });
        sendUserFirestore();
      }

      sendfirestore(companyInfo);
    },
  })),
);

export default useUserStore;
