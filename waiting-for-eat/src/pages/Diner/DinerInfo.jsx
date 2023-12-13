import { Button } from "@nextui-org/react";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FaPhoneSquareAlt } from "react-icons/fa";
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
    <div className="flex h-full  justify-center">
      <div className="flex h-[380px] w-3/4 items-center self-center rounded border-8 border-solid border-black/50">
        <div className="flex h-4/5 w-full items-center justify-center bg-white">
          <div className="m-6 flex h-3/4 w-1/3 items-center justify-center rounded-lg border-8 border-double border-gray-200 object-cover object-center">
            {userData.picture === "" ? (
              <p>尚無上傳照片</p>
            ) : (
              <img className="h-full" src={userData.picture} />
            )}
          </div>

          <div className="mr-6 w-2/3">
            <div className="mb-4 flex justify-center">
              <p className="text-4xl font-bold">{userData.userName}</p>
            </div>

            <div className="ml-12 mt-8">
              <div className="mb-4 flex">
                <div className="mb-2 mr-2 flex h-8 w-8 items-center justify-center rounded bg-black text-white">
                  <TbGenderFemale className="text-4xl" />
                </div>
                <p className="text-2xl">
                  {userData.gender === "小姐" ? "女" : "男"}
                </p>
              </div>

              <div className="mb-4 flex">
                <FaPhoneSquareAlt className="mr-2 text-4xl" />

                <p className="text-2xl">{userData.phone}</p>
              </div>

              <div className="flex justify-end">
                <Button
                  radius="full"
                  className="mt-6 block h-11 rounded-lg bg-[#ff850e] px-4 text-center text-lg font-black text-white shadow-lg"
                  onClick={() => navigate(`/diner/dinerInfoEdit/${userId}`)}
                >
                  編輯
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DinerInfo;
