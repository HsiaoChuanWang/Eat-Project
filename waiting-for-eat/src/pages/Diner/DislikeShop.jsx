import { Card, ScrollShadow } from "@nextui-org/react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { IconContext } from "react-icons";
import { HiThumbDown } from "react-icons/hi";
import { IoMdPin } from "react-icons/io";
import { IoRestaurant } from "react-icons/io5";
import { PiPhoneCallFill } from "react-icons/pi";
import { useNavigate, useParams } from "react-router-dom";
import IsLoading from "../../components/IsLoading/index.jsx";
import db from "../../firebase";
import noData from "./noData.png";

function DislikeShop() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [favorites, setFavorites] = useState([]);
  const [combineData, setCombineData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const favoriteq = query(
    collection(db, "favorite"),
    where("userId", "==", userId),
    where("status", "==", "dislike"),
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

      Promise.all(
        favoriteList.map((item) => {
          return Promise.all([getCompanyInfo(item.companyId)]).then(
            ([companyInfo]) => {
              const newItem = {
                ...item,
                ...companyInfo,
              };
              return newItem;
            },
          );
        }),
      ).then((value) => {
        setCombineData(value);
        setIsLoading(false);
      });
    });

    return favoriteSnap;
  }, []);

  const companyDatas =
    combineData.length > 0 ? (
      combineData.map((data, i) => {
        return (
          <motion.div
            animate={{ x: 0, opacity: 1, transition: { delay: 0.1 * i } }}
            initial={{ x: -50, opacity: 0 }}
            key={data.favoriteId}
          >
            <Card className="border-2 shadow-xl">
              <div className="relative flex items-center">
                <div className="bg-amber-800/30 p-6 py-8">
                  <div className="flex h-44 w-64 items-center justify-center">
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
                        <HiThumbDown />
                      </IconContext.Provider>
                    </div>
                    <p className="mr-1">|</p>
                    <p className="font-semibold">Bad</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })
    ) : (
      <div key="no" className="mr-8 flex h-full items-center justify-center">
        <img className="w-72" src={noData} />
        <h1 className="text-2xl font-bold text-gray-600">尚無相關資訊</h1>
      </div>
    );

  if (isLoading) {
    return <IsLoading />;
  }

  return (
    <div className="justify-cente flex h-full items-center">
      <ScrollShadow
        size={0}
        hideScrollBar
        className="flex h-[calc(100vh-300px)] w-full justify-center py-2"
      >
        <div className="flex h-full w-3/4 flex-col gap-12">{companyDatas}</div>
      </ScrollShadow>
    </div>
  );
}

export default DislikeShop;
