import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import useHeaderStore from "../src/stores/headerStore";
import useUserStore from "../src/stores/userStore";
import Footer from "./components/Footer";
import Header from "./components/Header";

function App() {
  const auth = getAuth();
  const detailInfo = useUserStore((state) => state.detailInfo);
  const getUserInfo = useUserStore((state) => state.getUserInfo);
  const getUserFirestore = useUserStore((state) => state.getUserFirestore);
  const isLogin = useUserStore((state) => state.isLogin);
  const getCompanyFirestore = useUserStore(
    (state) => state.getCompanyFirestore,
  );
  const setHeader = useHeaderStore((state) => state.setHeader);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const user = auth.currentUser;
        console.log("登入中");
        getUserInfo(user.providerId, user.uid);
        getUserFirestore(user.uid);
        if (detailInfo.companyId === "") {
          setHeader("DinerLogIn");
        } else {
          setHeader("BossLogIn");
          getCompanyFirestore();
        }
      } else {
        console.log("已登出");
        setHeader("LogOut");
      }
    });
  }, [isLogin]);

  useEffect(() => {
    if (detailInfo.companyId === "") {
      setHeader("DinerLogIn");
    } else {
      setHeader("BossLogIn");
      getCompanyFirestore();
    }
  }, [detailInfo.companyId]);

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
