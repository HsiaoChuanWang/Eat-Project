import { ConfigProvider } from "antd";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useHeaderStore from "../src/stores/headerStore";
import useUserStore from "../src/stores/userStore.js";
import Footer from "./components/Footer";
import Header from "./components/Header";

function App() {
  const auth = getAuth();
  const identity = useUserStore((state) => state.identity);
  const detailInfo = useUserStore((state) => state.detailInfo);
  const setUserId = useUserStore((state) => state.setUserId);
  const getUserInfoFromFirestoreAndSave = useUserStore(
    (state) => state.getUserInfoFromFirestoreAndSave,
  );
  const isLogin = useUserStore((state) => state.isLogin);
  const getCompanyInfoFromFirestoreAndSave = useUserStore(
    (state) => state.getCompanyInfoFromFirestoreAndSave,
  );
  const setHeader = useHeaderStore((state) => state.setHeader);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const user = auth.currentUser;
        Promise.all([
          setUserId(user.uid),
          getUserInfoFromFirestoreAndSave(user.uid),
        ]).then(([_, userInfo]) => {
          if (userInfo.userName !== "" && userInfo.companyId === "") {
            setHeader("DinerLogIn");
          } else if (userInfo.userName !== "" && userInfo.companyId !== "") {
            navigate(`/boss/bossInfo/${userInfo.companyId}`);
            setHeader("BossLogIn");
            getCompanyInfoFromFirestoreAndSave(userInfo.companyId);
          } else {
            setHeader("LogOut");
          }
        });
      }
    });
  }, [isLogin]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#ff850e",
          algorithm: true,
        },
        components: {
          Menu: {
            colorPrimary: "#ff850e",
            itemBg: "#e5e7eb",
            subMenuItemBg: "#f3f4f6",
            algorithm: true,
          },
        },
      }}
    >
      <Header />
      <Outlet />
      <Footer />
    </ConfigProvider>
  );
}

export default App;
