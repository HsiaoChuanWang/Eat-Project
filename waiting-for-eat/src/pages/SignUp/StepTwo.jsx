import { Input } from "@nextui-org/react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Bs2CircleFill } from "react-icons/bs";
import { FiEye, FiEyeOff } from "react-icons/fi";
import db, { auth, provider } from "../../firebase";
import useUserStore from "../../stores/userStore";
import googleLogo from "./signUpPictures/GoogleLogo.png";
import stepTwo from "./signUpPictures/stepTwo.jpg";

//native登入

function StepTwo({ setActive, identity }) {
  //儲存state
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const getUserInfo = useUserStore((state) => state.getUserInfo);

  //native sign up
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  function nextStep() {
    console.log();
    createUserWithEmailAndPassword(auth, email, password)
      .then((response) => {
        console.log("Sign up successfully!");
        const user = response.user;
        getUserInfo(user.providerId, user.uid);
      })
      .then(() => {
        identity === "diner"
          ? setActive("StepThreeDiner")
          : setActive("StepThreeBoss");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, "=", errorMessage);
        if (errorCode === "auth/email-already-in-use") {
          alert("此email已經註冊");
        } else if (errorCode === "auth/weak-password") {
          alert("密碼請至少填寫6碼");
        } else {
          alert("請確認email是否填寫正確");
        }
      });
  }

  //check google email
  async function checkGoogleAccount(googleId) {
    const docRef = doc(db, "user", googleId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return false;
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
      return true;
    }
  }

  //google sign up
  const googleSignUp = async () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(user);
        getUserInfo(user.providerId, user.uid);
      })
      .then(() => {
        const userId = auth.currentUser.uid;
        checkGoogleAccount(userId).then((result) => {
          if (result) {
            identity === "diner"
              ? setActive("StepThreeDiner")
              : setActive("StepThreeBoss");
          } else {
            alert("此google帳號已註冊");
          }
        });
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        // const email = error.customData.email;
        // The AuthCredential identity that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  return (
    <div className="relative flex h-[calc(100vh-96px)] w-screen">
      <img src={stepTwo} className="h-full w-3/5 object-cover object-center" />

      <div className="flex h-full w-2/5 items-center justify-center">
        <div
          className={`flex h-[520px] w-[450px] flex-col items-center justify-center rounded-2xl`}
        >
          <div className="mb-12 flex items-center gap-2 text-3xl font-black text-[#ff850e]">
            <Bs2CircleFill />
            <h1>註冊帳號</h1>
          </div>

          <div className="flex h-11 w-80 items-center justify-center gap-2 rounded-lg bg-slate-100 shadow-sm hover:cursor-pointer hover:bg-slate-200">
            <img src={googleLogo} className="h-6 w-6" />
            <button onClick={googleSignUp} className=" font-semibold">
              使用Google註冊
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
              onChange={(e) => setEmail(e.target.value)}
              className="mb-12 hover:border-red-300"
            />

            <Input
              label="Password"
              variant="bordered"
              labelPlacement="outside"
              color={"warning"}
              placeholder="請輸入至少6碼"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          </div>

          <button
            className="mr-8 mt-8 h-10 w-20 self-end rounded-lg bg-[#ff850e] font-bold text-white hover:bg-[#ff850e]/80"
            onClick={nextStep}
          >
            下一步
          </button>
        </div>
      </div>
    </div>
  );
}

export default StepTwo;
