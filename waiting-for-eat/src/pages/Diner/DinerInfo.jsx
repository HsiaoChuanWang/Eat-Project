import { Button } from "@nextui-org/react";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { BsTelephoneFill } from "react-icons/bs";
import { TbGenderFemale } from "react-icons/tb";
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
    <div className="flex h-full justify-center">
      <div className="relative flex h-[380px] w-2/3 items-center self-center rounded-3xl border-8 border-solid border-black/50 bg-[url('/src/pages/Diner/contentBg.png')]">
        <h1 className="absolute right-4 top-2 text-4xl font-black text-black/50">
          Foodies
        </h1>
        {/* <div className="relative flex h-2/3 w-full items-center justify-center bg-[#ece0ca] ">
          <div className="ml-12 flex h-48 w-48 items-center justify-center rounded-full border-8 border-double border-gray-200 bg-white object-cover object-center p-4">
            {userData.picture === "" ? (
              <p>尚無上傳照片</p>
            ) : (
              <img className="h-full" src={userData.picture} />
            )}
          </div>

          <div className="mr-6 w-2/3">
            <div className="ml-12 mt-2 flex">
              <p className="text-3xl font-bold">{userData.userName}</p>
            </div>

            <div className="ml-12 mt-6">
              <div className="mb-4 flex">
                <div className="mb-2 mr-2 flex h-8 w-8 items-center justify-center rounded bg-black text-white">
                  <TbGenderFemale className="text-4xl text-[#ece0ca]" />
                </div>
                <p className="text-2xl">
                  {userData.gender === "小姐" ? "女" : "男"}
                </p>
              </div>

              <div className="mb-4 flex ">
                <div className="mb-2 mr-2 flex h-8 w-8 items-center justify-center rounded bg-black text-white">
                  <BsTelephoneFill className="text-xl text-[#ece0ca]" />
                </div>
                <p className="text-2xl">{userData.phone}</p>
              </div>
            </div>
          </div> */}
        {/* </div> */}
        <div className="relative flex h-2/3 w-full items-center justify-center bg-[#ece0ca] ">
          <div className="ml-12 flex h-48 w-48 items-center justify-center rounded-full border-8 border-double border-gray-200 bg-white ">
            {userData.picture === "" ? (
              <p>尚無上傳照片</p>
            ) : (
              <img
                className="h-full w-full rounded-full object-cover object-right"
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

              <div className="mb-4 flex ">
                <div className="mb-2 mr-2 flex h-8 w-8 items-center justify-center rounded bg-black text-white">
                  <BsTelephoneFill className="text-xl text-[#ece0ca]" />
                </div>
                <p className="text-2xl font-bold">{userData.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-16 right-20">
        <Button
          radius="full"
          className="mt-6 block h-11 rounded-lg bg-[#ff850e] px-4 text-center text-lg font-black text-white shadow-lg"
          onClick={() => navigate(`/diner/dinerInfoEdit/${userId}`)}
        >
          編輯
        </Button>
      </div>
    </div>
  );
}

export default DinerInfo;
