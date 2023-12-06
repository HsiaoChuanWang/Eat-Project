import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import db from "../../firebase";
import useUserStore from "../../stores/userStore";

function BossInfo({ setContent }) {
  const { companyId } = useParams();
  const [type, setType] = useState("");
  const detailInfo = useUserStore((state) => state.detailInfo);
  const companyInfo = useUserStore((state) => state.companyInfo);
  const companyRef = doc(db, "company", companyId);

  useEffect(() => {
    getDoc(companyRef)
      .then((result) => {
        return result.data();
      })
      .then((data) => {
        const category = data.category;
        const categoryRef = doc(db, "category", category);
        return categoryRef;
      })
      .then((categoryRef) => {
        getDoc(categoryRef).then((res) => {
          const category = res.data();
          setType(category.type);
        });
      });
  }, []);

  return (
    <>
      <button
        onClick={() => {
          setContent("BossInfoEdit");
        }}
        className="absolute right-12 border-2 border-solid border-black"
      >
        編輯
      </button>
      <div>
        <h1 className="text-2xl font-bold">負責人資訊</h1>
        <div className="flex">
          <p className="my-6  text-xl">姓名</p>
          <p className="mx-4  my-6 text-xl">|</p>
          <p className="my-6  text-xl">{detailInfo.userName}</p>
        </div>
        <div className="flex">
          <p className="my-6  text-xl">電話</p>
          <p className="mx-4  my-6 text-xl">|</p>
          <p className="my-6  text-xl">{detailInfo.phone}</p>
        </div>

        <h1 className="text-2xl font-bold">店面資訊</h1>
        <div className="flex">
          <p className="my-6  text-xl">店名</p>
          <p className="mx-4  my-6 text-xl">|</p>
          <p className="my-6  text-xl">{companyInfo.name}</p>
        </div>
        <div className="flex">
          <p className="my-6  text-xl">電話</p>
          <p className="mx-4  my-6 text-xl">|</p>
          <p className="my-6  text-xl">{companyInfo.phone}</p>
        </div>
        <div className="flex">
          <p className="my-6  text-xl">地址</p>
          <p className="mx-4  my-6 text-xl">|</p>
          <p className="my-6  text-xl">
            {companyInfo.city}
            {companyInfo.district}
            {companyInfo.address}
          </p>
        </div>
        <div className="flex">
          <p className="my-6  text-xl">分類</p>
          <p className="mx-4  my-6 text-xl">|</p>
          <p className="my-6  text-xl">{type}</p>
        </div>
      </div>
    </>
  );
}

export default BossInfo;
