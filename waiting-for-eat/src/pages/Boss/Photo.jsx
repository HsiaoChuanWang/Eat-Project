import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import db from "../../firebase";
import useUserStore from "../../stores/userStore";

function Photo() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState({});
  const detailInfo = useUserStore((state) => state.detailInfo);
  const companyInfo = useUserStore((state) => state.companyInfo);
  const companyRef = doc(db, "company", companyId);

  useEffect(() => {
    const companySnap = onSnapshot(doc(db, "company", companyId), (result) => {
      const data = result.data();
      setCompanyData(data);
    });

    return companySnap;
  }, []);

  const mainPicture = companyData.picture ? (
    <img className="w-96" src={companyData.picture} />
  ) : (
    <div>尚無上傳照片</div>
  );

  const menus = companyData.menu ? (
    companyData.menu.map((picture, index) => {
      return <img className="w-36" src={picture} key={index} />;
    })
  ) : (
    <div>尚無上傳照片</div>
  );

  return (
    <>
      <button
        onClick={() => {
          navigate(`/boss/photoUpload/${companyId}`);
        }}
        className="absolute right-16 border-2 border-solid border-black"
      >
        編輯
      </button>
      <div>
        <h1 className="text-2xl font-bold">封面照片</h1>
        <div>{mainPicture}</div>

        <h1 className="mt-6 text-2xl font-bold">菜單照片</h1>
        <div className="flex">{menus}</div>
      </div>
    </>
  );
}

export default Photo;
