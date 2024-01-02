import { Button } from "@nextui-org/react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { BsTelephoneFill } from "react-icons/bs";
import { IoMdPin } from "react-icons/io";
import { IoRestaurant } from "react-icons/io5";
import { MdAdsClick, MdFastfood } from "react-icons/md";
import { PiPhoneCallFill } from "react-icons/pi";
import { TbGenderFemale } from "react-icons/tb";
import { useNavigate, useParams } from "react-router-dom";
import IsLoading from "../../components/IsLoading/index.jsx";
import db from "../../firebase";
import useUserStore from "../../stores/userStore.js";
import boss from "../SignUp/signUpPictures/boss.png";

function BossInfo() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [type, setType] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const userId = useUserStore((state) => state.userId);
  const [userData, setUserData] = useState({});
  const [companyData, setCompanyData] = useState({});

  async function getCategory(category) {
    const categoryRef = doc(db, "category", category);
    await getDoc(categoryRef).then((res) => {
      const category = res.data();
      setType(category.type);
    });
  }

  useEffect(() => {
    if (userId) {
      const userSnap = onSnapshot(doc(db, "user", userId), (doc) => {
        const data = doc.data();
        setUserData(data);
      });

      const companySnap = onSnapshot(doc(db, "company", companyId), (doc) => {
        const data = doc.data();
        setCompanyData(data);
        const category = data.category;
        getCategory(category);
        setIsLoading(false);
      });

      return companySnap, userSnap;
    }
  }, [userId]);

  if (isLoading) {
    return <IsLoading />;
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <label className="swap swap-flip text-9xl">
        <input type="checkbox" />

        <div className="swap-off flex flex-col">
          <div className="mb-2 mr-2 flex items-center gap-2 self-end">
            <MdAdsClick className="text-3xl" />
            <h1 className="text-base">點擊名片以查看餐廳資訊</h1>
          </div>

          <div className="relative flex h-[380px] w-[640px] items-center self-center rounded-3xl border-8 border-solid border-black/50 bg-[url('/src/pages/Diner/contentBg.png')]">
            <h1 className="absolute right-4 top-2 text-4xl font-black text-black/50">
              Owner
            </h1>
            <div className="relative flex h-2/3 w-full items-center justify-center bg-[#ece0ca] ">
              <div className="ml-12 flex h-48 w-48 items-center justify-center rounded-full border-8 border-double border-gray-200 bg-white ">
                {userData.picture === "" ? (
                  <img
                    className="h-full w-full rounded-full object-cover object-center"
                    src={boss}
                  />
                ) : (
                  <img
                    className="h-full w-full rounded-full object-cover object-center"
                    src={userData.picture}
                  />
                )}
              </div>

              <div className="mr-6 w-1/2">
                <div className="ml-12 mt-2 flex">
                  <p className="text-3xl font-bold">{userData.userName}</p>
                </div>

                <div className="ml-12 mt-6">
                  <div className="mb-4 flex">
                    <div className="mb-2 mr-2 flex h-8 w-8 items-center justify-center rounded bg-black text-white">
                      <TbGenderFemale className="text-4xl text-[#ece0ca]" />
                    </div>
                    <p className="text-2xl font-bold">
                      {userData.gender === "小姐" ? "女" : "男"}
                    </p>
                  </div>

                  <div className="mb-4 flex font-bold">
                    <div className="mb-2 mr-2 flex h-8 w-8 items-center justify-center rounded bg-black text-white">
                      <BsTelephoneFill className="text-xl text-[#ece0ca]" />
                    </div>
                    <p className="text-2xl">{userData.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="swap-on flex flex-col">
          <div className="mb-2 mr-2 flex items-center gap-2 self-end">
            <MdAdsClick className="text-3xl" />
            <h1 className="text-base">點擊名片以查看個人資訊</h1>
          </div>

          <div className="relative flex h-[380px] w-[640px] items-center rounded-3xl border-8 border-solid border-black/50 bg-[url('/src/pages/Diner/contentBg.png')]">
            <h1 className="absolute right-4 top-2 text-4xl font-black text-black/50">
              Restaurant
            </h1>

            <div className="absolute top-14 h-12 w-full bg-black/50"></div>
            <div className="absolute top-28 h-1 w-full bg-black/50"></div>

            <div className="ml-12 mt-28 rounded-2xl bg-[#ece0ca] px-6 py-4">
              <div className="mb-4 flex items-center text-black">
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

              <div className="mt-4 flex items-center text-black">
                <MdFastfood className="mr-4 text-2xl" />
                <p className="text-xl font-black">{type}</p>
              </div>
            </div>
          </div>
        </div>
      </label>
      <div className="absolute bottom-16 right-20">
        <Button
          radius="full"
          className="mt-6 block h-11 rounded-lg bg-[#ff850e] px-4 text-center text-lg font-black text-white shadow-lg"
          onClick={() => navigate(`/boss/bossInfoEdit/${companyId}`)}
        >
          編輯
        </Button>
      </div>
    </div>
  );
}

export default BossInfo;
