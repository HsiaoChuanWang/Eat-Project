import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import db from "../firebase";

const useUserStore = create(
  immer((set, get) => ({
    isLogin: false,

    setIsLogin: () => {
      set((state) => {
        state.isLogin = true;
      });
    },

    setIsLogout: () => {
      set((state) => {
        state.isLogin = false;
      });
      set((state) => {
        state.userInfo = {
          providerId: "",
          userId: "",
        };
      });
      set((state) => {
        state.detailInfo = {
          userName: "",
          address: "",
          companyId: "",
          gender: "",
          phone: "",
          picture: "",
          status: "active",
        };
      });
      set((state) => {
        state.companyInfo = {
          name: "",
          city: "",
          district: "",
          address: "",
          lat: "",
          lng: "",
          phone: "",
          category: "",
          picture: "",
          menu: [],
        };
      });
    },

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
      picture: "",
      menu: [],
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

    getUserFirestore: (userId) => {
      async function getfirestore() {
        const docRef = doc(db, "user", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const result = docSnap.data();
          set((state) => {
            state.detailInfo = result;
          });
        } else {
          console.log("No such userInfo document!");
        }
      }
      getfirestore();
    },

    getCompanyInfo: (data) => {
      set((state) => {
        state.companyInfo = data;
      });
    },

    sendCompanyFirestore: () => {
      const companyInfo = get().companyInfo;
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

    getCompanyFirestore: () => {
      const companyId = get().detailInfo.companyId;

      async function getfirestore() {
        const docRef = doc(db, "company", companyId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const result = docSnap.data();
          set((state) => {
            state.companyInfo = result;
          });
        } else {
          console.log("No such document!");
        }
      }
      getfirestore();
    },
  })),
);

export default useUserStore;
