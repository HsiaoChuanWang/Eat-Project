import { ConfigProvider } from "antd";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useHeaderStore from "../src/stores/headerStore";
import useUserStore from "../src/stores/userStore.js";
import Footer from "./components/Footer";
import Header from "./components/Header";

function App() {
  const auth = getAuth();
  const setUserId = useUserStore((state) => state.setUserId);
  const getUserInfoFromFirestoreAndSave = useUserStore(
    (state) => state.getUserInfoFromFirestoreAndSave,
  );
  const getCompanyInfoFromFirestoreAndSave = useUserStore(
    (state) => state.getCompanyInfoFromFirestoreAndSave,
  );
  const setHeader = useHeaderStore((state) => state.setHeader);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const pathParts = location.pathname.split("/");
    const firstParam = pathParts[1];
    const thirdParam = pathParts[3];

    onAuthStateChanged(auth, (user) => {
      if (user === null) {
        setHeader("LogOut");
        const logOutCannotEnterPath = ["reserve", "diner", "boss"];
        if (logOutCannotEnterPath.some((path) => firstParam?.includes(path))) {
          navigate("/");
        }
      }

      if (user) {
        const user = auth.currentUser;
        const userId = user.uid;
        Promise.all([
          setUserId(userId),
          getUserInfoFromFirestoreAndSave(userId),
        ]).then(([_, userInfo]) => {
          if (userInfo.companyId === "") {
            setHeader("DinerLogIn");

            firstParam?.includes("boss") && navigate("/");
            if (thirdParam) {
              !thirdParam.includes(userId) && navigate("/");
            }
          } else if (userInfo.companyId !== "") {
            setHeader("BossLogIn");
            getCompanyInfoFromFirestoreAndSave(userInfo.companyId);

            !thirdParam?.includes(userInfo.companyId) &&
              navigate(`/boss/bossInfo/${userInfo.companyId}`);
          }
        });
      }
    });
  }, [location.pathname]);

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
