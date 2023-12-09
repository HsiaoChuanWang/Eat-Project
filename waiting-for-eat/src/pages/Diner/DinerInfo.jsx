import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import db from "../../firebase";

function DinerInfo() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const userSnap = onSnapshot(doc(db, "user", userId), (doc) => {
      const data = doc.data();
      setUserData(data);
    });

    return userSnap;
  }, []);

  return (
    <>
      <button
        onClick={() => navigate(`/diner/dinerInfoEdit/${userId}`)}
        className="absolute right-0 border-2 border-solid border-black"
      >
        編輯
      </button>
      <div>
        <h1 className="text-2xl font-bold">食客資訊</h1>
        <div className="flex">
          <p className="my-6  text-xl">姓名</p>
          <p className="mx-4  my-6 text-xl">|</p>
          <p className="my-6  text-xl">{userData.userName}</p>
        </div>

        <div className="flex">
          <p className="my-6  text-xl">性別</p>
          <p className="mx-4  my-6 text-xl">|</p>
          <p className="my-6  text-xl">
            {userData.gender === "小姐" ? "女" : "男"}
          </p>
        </div>

        <div className="flex">
          <p className="my-6  text-xl">電話</p>
          <p className="mx-4  my-6 text-xl">|</p>
          <p className="my-6  text-xl">{userData.phone}</p>
        </div>

        <div className="flex">
          <p className="my-6  text-xl">大頭照</p>
          <p className="mx-4  my-6 text-xl">|</p>
          {userData.picture === "" ? (
            <p>尚無上傳照片</p>
          ) : (
            <img src={userData.picture} />
          )}
        </div>
      </div>
    </>
  );
}

export default DinerInfo;
