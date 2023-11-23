import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import React, { useState } from "react";
import db from "../firebase";

function Test() {
  const [food, setFood] = useState([]);
  const [companyId, setCompanyId] = useState("");

  //取得companyId
  async function getcompanyId() {
    const companyRef = collection(db, "company");
    const q = query(companyRef, where("name", "==", "秋吉串燒"));
    const querySnapshotCompany = await getDocs(q);

    let selectedCampany;
    querySnapshotCompany.forEach((doc) => {
      selectedCampany = doc.id;
      setCompanyId(selectedCampany);
    });
    console.log("get id", companyId);
  }

  //搜尋子集合
  async function getData() {
    const companyRef = collection(db, "company");
    const datas = query(collection(companyRef, companyId, "food"));
    let foods = [];
    const querySnapshotCategory = await getDocs(datas);
    querySnapshotCategory.forEach((doc) => {
      foods.push(doc.data());
      setFood(foods);
    });
    console.log("get data");
  }

  //新增子集合資料
  async function addData() {
    const companyRef = collection(db, "company");
    const docRef = await addDoc(collection(companyRef, companyId, "food"), {
      orange: "orangeorange",
    });
    console.log("Document written with ID: ", docRef.id);
  }
  console.log(food);

  return (
    <>
      <h3>我是子集合的資料</h3>
      {food.map((element, index) => {
        return <p key={index}>{element.orange}</p>;
      })}
      <p>banana</p>
      <button onClick={getcompanyId}>得到公司id</button>
      <button onClick={addData}>我想送東西進去子集合</button>
      <button onClick={getData}>我想從子集抓東西出來</button>
    </>
  );
}

export default Test;
