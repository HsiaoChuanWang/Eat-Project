import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { default as React, useState } from "react";
import { useNavigate } from "react-router-dom";
import { provider } from "../../firebase";
import useUserStore from "../../stores/userStore";
import googlelogo from "../SignUp/googleLogo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const getUserInfo = useUserStore((state) => state.getUserInfo);
  const getUserFirestore = useUserStore((state) => state.getUserFirestore);
  const setIsLogin = useUserStore((state) => state.setIsLogin);

  //native login
  const auth = getAuth();
  function nativeLogin() {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Login successfully!");
        getUserInfo(user.providerId, user.uid);
        getUserFirestore(user.uid);
        alert("登入成功");
        setIsLogin();
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert("請確認email及密碼是否輸入正確");
        console.log((errorCode, "=", errorMessage));
      });
  }

  //google login
  const googleLogin = async () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log("Google login successfully!");
        getUserInfo(user.providerId, user.uid);
        getUserFirestore(user.uid);
        alert("登入成功");
        setIsLogin();
        navigate("/");
      })
      .then(() => {})
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log((errorCode, "=", errorMessage));
      });
  };

  return (
    <>
      <div className="flex">
        <h2 className="ml-4 py-12 text-center text-2xl">email</h2>

        <input
          className="m-8 border-2 border-solid border-black text-xl"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
      </div>

      <div className="flex">
        <h2 className="ml-4 py-12 text-center text-2xl">密碼</h2>

        <input
          className="m-8 border-2 border-solid border-black text-xl"
          placeholder="請輸入至少6碼"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
      </div>

      <span className="h-20">------or------</span>
      <div className="flex w-36 border-2 border-solid border-red-800 ">
        <img src={googlelogo} className="h-8 w-8" />
        <button onClick={googleLogin} className="ml-4">
          Google登入
        </button>
      </div>

      <button
        className="my-8 ml-48 border-2 border-solid border-black text-xl"
        onClick={nativeLogin}
      >
        登入
      </button>
    </>
  );
}

export default Login;
