import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import db from "../../firebase";
import useUserStore from "../../stores/userStore";

function Photo({ setContent }) {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [type, setType] = useState("");
  const detailInfo = useUserStore((state) => state.detailInfo);
  const companyInfo = useUserStore((state) => state.companyInfo);
  const companyRef = doc(db, "company", companyId);

  useEffect(() => {
    getDoc(companyRef)
      .then((result) => {
        const data = result.data();
        return data;
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

  const menus = companyInfo.menu.map((picture, index) => {
    return <img className="w-36" src={picture} key={index} />;
  });

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
        <div>
          <img className="w-96" src={companyInfo.picture} />
        </div>

        <h1 className="mt-6 text-2xl font-bold">菜單照片</h1>
        <div className="flex">{menus}</div>
      </div>
    </>
  );
}

export default Photo;