import { Input } from "@nextui-org/react";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { default as React, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Alert from "../../components/Alert";
import { provider } from "../../firebase";
import useTestStore from "../../stores/testStore.js";
import useUserStore from "../../stores/userStore.js";
import googleLogo from "../SignUp/signUpPictures/GoogleLogo.png";
import boss from "../SignUp/signUpPictures/boss.png";
import cook from "../SignUp/signUpPictures/cook.png";
import diner from "../SignUp/signUpPictures/diner.png";
import loginBackground from "./loginBackground.jpg";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //   const [identity, setIdentity] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const navigate = useNavigate();
  const setLoginIdentity = useTestStore((state) => state.setLoginIdentity);
  const setTestAccount = useTestStore((state) => state.setTestAccount);
  const setTestPassword = useTestStore((state) => state.setTestPassword);
  const loginIdentity = useTestStore((state) => state.loginIdentity);
  const testAccount = useTestStore((state) => state.testAccount);
  const testPassword = useTestStore((state) => state.testPassword);
  const setUserId = useUserStore((state) => state.setUserId);
  const getUserInfoFromFirestoreAndSave = useUserStore(
    (state) => state.getUserInfoFromFirestoreAndSave,
  );

  useEffect(() => {
    if (testAccount !== "") {
      setEmail(testAccount);
      setPassword(testPassword);
    }
  }, []);

  //native login
  const auth = getAuth();
  function nativeLogin() {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        Promise.all([
          setUserId(user.uid),
          getUserInfoFromFirestoreAndSave(user.uid),
        ]).then(([_, userInfo]) => {
          if (userInfo.companyId === "") {
            navigate("/");
          } else {
            navigate(`/boss/bossInfo/${userInfo.companyId}`);
          }
          toast.success("登入成功");
          setLoginIdentity("");
          setTestAccount("");
          setTestPassword("");
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error("請確認email及密碼是否輸入正確");
        console.log((errorCode, "=", errorMessage));
      });
  }

  //google login
  function googleLogin() {
    signInWithPopup(auth, provider)
      .then((userCredential) => {
        const user = userCredential.user;
        Promise.all([
          setUserId(user.uid),
          getUserInfoFromFirestoreAndSave(user.uid),
        ]).then(([_, userInfo]) => {
          if (userInfo.companyId === "") {
            navigate("/");
          } else {
            navigate(`/boss/bossInfo/${userInfo.companyId}`);
          }
          toast.success("登入成功");
          setLoginIdentity("");
          setTestAccount("");
          setTestPassword("");
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error("請確認email及密碼是否輸入正確");
        console.log((errorCode, "=", errorMessage));
      });
  }

  function saveIdentity(identity) {
    setLoginIdentity(identity);
  }

  return (
    <div className="relative flex h-[calc(100vh-96px)] w-screen">
      <Alert />
      <img
        src={loginBackground}
        className="h-full w-3/5 object-cover object-center"
      />

      <div className="flex h-full w-2/5 items-center justify-center">
        <div
          className={`${
            loginIdentity !== "" && "hidden"
          } flex h-[520px] w-[450px] flex-col items-center justify-center rounded-2xl bg-white`}
        >
          <h1 className="mb-12 text-3xl font-black text-[#ff850e]">
            請選擇登入身份
          </h1>
          <div
            onClick={() => saveIdentity("diner")}
            className="mb-8 flex cursor-pointer items-center rounded-lg bg-slate-100 hover:bg-slate-200 hover:text-gray-600"
          >
            <img src={diner} className="h-32" />
            <div className="mr-8 w-32 text-center">
              <h2 className="text-2xl font-bold">食客</h2>
              <h3 className=" text-base font-bold">Foodie</h3>
            </div>
          </div>

          <div
            onClick={() => saveIdentity("boss")}
            className="flex cursor-pointer items-center rounded-lg bg-slate-100 hover:bg-slate-200 hover:text-gray-600"
          >
            <div className="ml-8 w-32 text-center">
              <h2 className="text-2xl font-bold">餐廳業者</h2>
              <h3 className=" text-base font-bold">Owner</h3>
            </div>
            <img src={boss} className="h-32" />
          </div>
        </div>

        <div
          className={`${
            loginIdentity === "" && "hidden"
          } flex h-[520px] w-[450px] flex-col items-center justify-center rounded-2xl bg-white`}
        >
          <div className="mt-1 flex w-full items-center">
            <img src={cook} className="w-56" />
            <div>
              <h1 className="mb-1 text-2xl font-black">Waiting for eat</h1>
              <h1 className="mb-1 font-bold">期待與你一起</h1>
              <h1 className="text-base font-bold">食不相瞞 口耳相傳</h1>
            </div>
          </div>

          <div className="flex h-11 w-80 items-center justify-center gap-2 rounded-lg bg-slate-100 shadow-sm hover:cursor-pointer hover:bg-slate-200">
            <img src={googleLogo} className="h-6 w-6" />
            <button onClick={googleLogin} className=" font-semibold">
              使用Google登入
            </button>
          </div>

          <div className="my-4 flex w-80 items-center">
            <div className="w-full border-t border-solid border-gray-800"></div>
            <span className="px-2 text-sm text-gray-500">or</span>
            <div className="w-full border-t border-solid border-gray-500"></div>
          </div>

          <div className="w-80">
            <Input
              type="email"
              variant="bordered"
              labelPlacement="outside"
              color={"warning"}
              label="Email"
              placeholder="test@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="mb-12 hover:border-red-300"
            />

            <Input
              label="Password"
              variant="bordered"
              labelPlacement="outside"
              color={"warning"}
              placeholder="請輸入至少6碼"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <FiEye className="pointer-events-none text-xl text-default-400" />
                  ) : (
                    <FiEyeOff className="pointer-events-none text-xl text-default-400" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
              className="mb-8"
            />

            <button
              className="mb-8 h-10 w-full rounded-lg bg-[#ff850e] font-bold text-white hover:bg-[#ff850e]/80"
              onClick={nativeLogin}
            >
              登入
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
