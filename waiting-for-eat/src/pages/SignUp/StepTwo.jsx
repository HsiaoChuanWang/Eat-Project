import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useState } from "react";
import db, { auth, provider } from "../../firebase";
import useUserStore from "../../stores/userStore";
import googlelogo from "./googleLogo.png";

//native登入

function StepTwo({ setActive, type }) {
  //儲存state
  const getUserInfo = useUserStore((state) => state.getUserInfo);

  //native sign up
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  function handleNext() {
    createUserWithEmailAndPassword(auth, email, password)
      .then((response) => {
        console.log("Sign up successfully!");
        const user = response.user;
        getUserInfo(user.providerId, user.uid);
      })
      .then(() => {
        type === "食客"
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
  const login = async () => {
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
            type === "食客"
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
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  return (
    <>
      <div className="flex">
        <h2 className="ml-4 py-12 text-center text-2xl">email</h2>
        <h2 className="ml-1 py-12 text-2xl text-red-600">*</h2>
        <input
          className="m-8 border-2 border-solid border-black text-xl"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
      </div>

      <div className="flex">
        <h2 className="ml-4 py-12 text-center text-2xl">密碼</h2>
        <h2 className="ml-1 py-12 text-2xl text-red-600">*</h2>
        <input
          className="m-8 border-2 border-solid border-black text-xl"
          placeholder="請輸入至少6碼"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
      </div>

      <h2 className="ml-1 py-12 text-2xl text-red-600">*必填項目</h2>

      <span className="h-20">------or------</span>
      <div className="flex w-36 border-2 border-solid border-red-800 ">
        <img src={googlelogo} className="h-8 w-8" />
        <button onClick={login} className="ml-4">
          登入Google
        </button>
      </div>

      <button
        className="my-8 ml-48 border-2 border-solid border-black text-xl"
        onClick={handleNext}
      >
        下一步
      </button>
    </>
  );
}

export default StepTwo;
