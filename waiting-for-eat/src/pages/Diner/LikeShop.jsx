import { Card, ScrollShadow } from "@nextui-org/react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { IconContext } from "react-icons";
import { HiThumbUp } from "react-icons/hi";
import { IoMdPin } from "react-icons/io";
import { IoRestaurant } from "react-icons/io5";
import { PiPhoneCallFill } from "react-icons/pi";
import { useNavigate, useParams } from "react-router-dom";
import db from "../../firebase";

function LikeShop() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [favorites, setFavorites] = useState([]);
  const [combineData, setCombineData] = useState([]);
  const favoriteq = query(
    collection(db, "favorite"),
    where("userId", "==", userId),
    where("status", "==", "like"),
  );

  async function getCompanyInfo(companyId) {
    const docRef = doc(db, "company", companyId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const resultUser = docSnap.data();
      return resultUser;
    } else {
      console.log("No such comment companyInfo document!");
    }
  }

  useEffect(() => {
    const favoriteSnap = onSnapshot(favoriteq, (result) => {
      let favoriteList = [];
      result.forEach((doc) => {
        const data = doc.data();
        const dataId = doc.id;
        const combine = { ...data, favoriteId: dataId };
        favoriteList.push(combine);
      });
      setFavorites(favoriteList);

      let companyList = [];
      favoriteList.forEach((item) => {
        getCompanyInfo(item.companyId)
          .then((data) => {
            const newData = Object.assign(item, data);
            companyList.push(newData);
          })
          .then(() => {
            setCombineData([...companyList]);
          });
      });
    });

    return favoriteSnap;
  }, []);

  const handleLike = async (favoriteId, change) => {
    const favoriteRef = doc(db, "favorite", favoriteId);
    await updateDoc(favoriteRef, {
      status: change,
    });
  };

  const companyDatas =
    combineData.length > 0 ? (
      combineData.map((data) => {
        return (
          <Card className="mb-8 border-2 border-solid border-gray-800 shadow-[-8px_8px_4px_2px_rgba(0,0,0,0.2)]">
            <div key={data.favoriteId} className="relative flex items-center">
              <div className="bg-amber-800/30 py-8 pl-6 pr-10">
                <div className="flex h-40 w-64 items-center justify-center">
                  <img
                    className="h-full w-full cursor-pointer rounded-lg object-cover object-center"
                    src={data.picture}
                    onClick={() => {
                      navigate(`/restaurant/${data.companyId}`);
                    }}
                  />
                </div>
              </div>

              <div className="ml-4">
                <div className="flex items-center">
                  <IoRestaurant className="mr-2 text-2xl" />
                  <p className="text-lg font-bold">{data.name}</p>
                </div>

                <div className="mt-4 flex items-center">
                  <PiPhoneCallFill className="mr-2 text-2xl" />
                  <p className="text-lg font-bold">{data.phone}</p>
                </div>

                <div className="mt-4 flex items-center">
                  <IoMdPin className="mr-2 text-2xl" />
                  <p className="text-lg font-bold">
                    {data.city}
                    {data.district}
                    {data.address}
                  </p>
                </div>
              </div>

              <div className="absolute right-4 top-4 flex w-24 items-center justify-between">
                <div className="flex h-10 w-28 items-center justify-center rounded-xl border border-solid bg-gray-200">
                  <div className="mr-1">
                    <IconContext.Provider value={{ size: "30px" }}>
                      <HiThumbUp />
                    </IconContext.Provider>
                  </div>
                  <p className="mr-1">|</p>
                  <p className="font-semibold">Like</p>
                </div>
              </div>
            </div>
          </Card>
        );
      })
    ) : (
      <h1 key="no">未有相關資訊</h1>
    );

  return (
    <div className="justify-cente flex h-full items-center">
      <ScrollShadow
        size={0}
        hideScrollBar
        className="flex h-[calc(100vh-300px)] w-full justify-center"
      >
        <div className="flex h-full w-3/4 justify-center">
          <div className="w-full">{companyDatas}</div>
        </div>
      </ScrollShadow>
    </div>
  );
}

export default LikeShop;
