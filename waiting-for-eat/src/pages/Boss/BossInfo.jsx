import { Button } from "@nextui-org/react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FaPhoneSquareAlt } from "react-icons/fa";
import { IoMdPin } from "react-icons/io";
import { IoRestaurant } from "react-icons/io5";
import { MdFastfood } from "react-icons/md";
import { PiPhoneCallFill } from "react-icons/pi";
import { TbGenderFemale } from "react-icons/tb";
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
    if (userInfo.userId) {
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
    }
  }, [userInfo.userId]);

  return (
    <div className="flex h-full justify-center">
      <div className="ml-12 h-[400px] w-1/2 items-center self-center rounded border-8 border-solid border-black/50">
        <h1 className="m-4 text-xl font-black text-gray-600">負責人資訊</h1>
        <div className="relative h-4/5 w-full items-center justify-center bg-white">
          <div className="my-6 flex h-[150px] w-full items-center justify-center rounded-lg object-cover object-center">
            {userData.picture === "" ? (
              <p>尚無上傳照片</p>
            ) : (
              <img className="h-full" src={userData.picture} />
            )}
          </div>

          <div className="m-4">
            <div className="mb-4 flex justify-center">
              <p className="text-2xl font-bold">{userData.userName}</p>
            </div>

            <div className="my-4 flex">
              <div className="mb-2 mr-4 flex h-6 w-6 items-center justify-center rounded bg-black text-white">
                <TbGenderFemale className="text-3xl" />
              </div>
              <p className="text-xl font-black">
                {userData.gender === "小姐" ? "女" : "男"}
              </p>
            </div>

            <div className="my-4 flex items-center text-black">
              <FaPhoneSquareAlt className="mr-4 text-2xl" />
              <p className="text-xl font-black">{userData.phone}</p>
            </div>

            <Button
              radius="full"
              className="absolute bottom-2 right-4 mt-6 block h-11 rounded-lg bg-[#ff850e] px-4 text-center text-lg font-black text-white shadow-lg"
              onClick={() => navigate(`/boss/bossInfoEdit/${companyId}`)}
            >
              編輯
            </Button>
          </div>
        </div>
      </div>

      <div className="relative m-12 h-[400px] w-1/2 items-center self-center rounded border-8 border-solid border-black/50">
        <h1 className="m-4 text-xl font-black text-gray-600">餐廳資訊</h1>

        <div className="m-4">
          <div className="mb-4 mt-12 flex items-center text-black">
            <IoRestaurant className="mr-4 text-2xl" />
            <p className="text-xl font-black">{companyData.name}</p>
          </div>

          <div className="my-4 flex items-center text-black">
            <PiPhoneCallFill className="mr-4 text-2xl" />
            <p className="text-xl font-black">{companyData.phone}</p>
          </div>

          <div className="my-4 flex items-center text-black">
            <IoMdPin className="mr-4 text-2xl" />
            <p className="text-xl font-black">
              {companyData.city}
              {companyData.district}
              {companyData.address}
            </p>
          </div>

          <div className="my-4 flex items-center text-black">
            <MdFastfood className="mr-4 text-3xl" />
            <p className="text-2xl font-black">{type}</p>
          </div>

          <Button
            radius="full"
            className="absolute bottom-4 right-4 mt-6 block h-11 rounded-lg bg-[#ff850e] px-4 text-center text-lg font-black text-white shadow-lg"
            onClick={() => navigate(`/boss/bossInfoEdit/${companyId}`)}
          >
            編輯
          </Button>
        </div>
      </div>
    </div>
  );
}

export default BossInfo;
