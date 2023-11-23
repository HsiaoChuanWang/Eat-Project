import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";

//native登入

function Post() {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {}, []);
  function handleClick() {
    console.log(password);
    console.log(email);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        // ...
        console.log(user);
        console.log(auth.currentUser);
      })
      .then(() => {
        updateProfile(auth.currentUser, {
          displayName: "Jane Q. User",
          photoURL: "https://example.com/jane-q-user/profile.jpg",
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }

  return (
    <>
      <input
        placeholder="帳號"
        value={account}
        onChange={(e) => setAccount(e.target.value)}
      ></input>
      <input
        placeholder="密碼"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      ></input>
      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      ></input>
      <button onClick={handleClick}>send</button>
    </>
  );
}

export default Post;
