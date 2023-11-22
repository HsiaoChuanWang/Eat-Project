import {
  addDoc,
  collection,
  collectionGroup,
  getDocs,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import db from "../../firebase";

//取得子集合資料
async function getData({ setFood }) {
  const datas = query(collectionGroup(db, "food"));
  const querySnapshot = await getDocs(datas);
  querySnapshot.forEach((doc) => {
    setFood(doc.data());
  });
}

//新增子集合資料
async function addData() {
  const companyRef = collection(db, "company");
  const docRef = await addDoc(
    collection(companyRef, "iXMWwyDZeyWJZ9FryUex", "food"),
    { orange: "orangeorange" }
  );
  console.log("Document written with ID: ", docRef.id);
}

function Post() {
  const [food, setFood] = useState({});

  useEffect(() => {
    getData({ setFood });
  }, []);

  return (
    <>
      <h3>我是首頁</h3>
      <h3>我是子集合的資料</h3>
      <p>apple</p>
      <p>banana</p>
      <button onClick={addData}>我想送東西進去子集合</button>
      <h3>再抓新增的子集合資料</h3>
      <p>好像沒有比較方便，讓我們放棄他</p>
    </>
  );
}

export default Post;
