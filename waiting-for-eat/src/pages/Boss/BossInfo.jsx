import { doc, getDoc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import db from "../../firebase";
import useUserStore from "../../stores/userStore";

function BossInfo() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [type, setType] = useState("");
  const userInfo = useUserStore((state) => state.userInfo);
  const [userData, setUserData] = useState({});
  const [companyData, setCompanyData] = useState({});
  const detailInfo = useUserStore((state) => state.detailInfo);
  const companyInfo = useUserStore((state) => state.companyInfo);

  async function getCategory(category) {
    const categoryRef = doc(db, "category", category);
    await getDoc(categoryRef).then((res) => {
      const category = res.data();
      setType(category.type);
    });
  }

  useEffect(() => {
    const userSnap = onSnapshot(doc(db, "user", userInfo.userId), (doc) => {
      const data = doc.data();
      setUserData(data);
    });

    const companySnap = onSnapshot(doc(db, "company", companyId), (doc) => {
      const data = doc.data();
      setCompanyData(data);
      const category = data.category;
      getCategory(category);
    });

    return companySnap, userSnap;
  }, []);

  return (
    <>
      <button
        onClick={() => {
          navigate(`/boss/bossInfoEdit/${companyId}`);
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
          <p className="my-6  text-xl">{userData.userName}</p>
        </div>
        <div className="flex">
          <p className="my-6  text-xl">電話</p>
          <p className="mx-4  my-6 text-xl">|</p>
          <p className="my-6  text-xl">{userData.phone}</p>
        </div>

        <h1 className="text-2xl font-bold">店面資訊</h1>
        <div className="flex">
          <p className="my-6  text-xl">店名</p>
          <p className="mx-4  my-6 text-xl">|</p>
          <p className="my-6  text-xl">{companyData.name}</p>
        </div>
        <div className="flex">
          <p className="my-6  text-xl">電話</p>
          <p className="mx-4  my-6 text-xl">|</p>
          <p className="my-6  text-xl">{companyData.phone}</p>
        </div>
        <div className="flex">
          <p className="my-6  text-xl">地址</p>
          <p className="mx-4  my-6 text-xl">|</p>
          <p className="my-6  text-xl">
            {companyData.city}
            {companyData.district}
            {companyData.address}
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
