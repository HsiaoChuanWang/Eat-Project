import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { IconContext } from "react-icons";
import { HiThumbDown } from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";
import db from "../../firebase";

function DislikeShop() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [favorites, setFavorites] = useState([]);
  const [combineData, setCombineData] = useState([]);
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

      let companyList = [];
      favoriteList.forEach((item) => {
        getCompanyInfo(item.companyId)
          .then((data) => {
            const newData = Object.assign(item, data);
            companyList.push(newData);
          })
          .then(() => {
            setCombineData(companyList);
          });
      });
    });

    return favoriteSnap;
  }, []);

  const companyDatas =
    combineData.length > 0 ? (
      combineData.map((data) => {
        return (
          <div
            key={data.favoriteId}
            className="relative flex items-center border-2 border-solid border-black"
          >
            <div className="w-64">
              <img
                src={data.picture}
                onClick={() => {
                  navigate(`/restaurant/${data.companyId}`);
                }}
              />
            </div>
            <div className=" ml-4">
              <div className="flex">
                <p className="my-4  text-xl">餐廳名稱</p>
                <p className="mx-4  my-4 text-xl">|</p>
                <p className="my-4  text-xl">{data.name}</p>
              </div>

              <div className="flex">
                <p className="my-4  text-xl">電話</p>
                <p className="mx-4  my-4 text-xl">|</p>
                <p className="my-4  text-xl">{data.phone}</p>
              </div>

              <div className="flex">
                <p className="my-4  text-xl">地址</p>
                <p className="mx-4  my-4 text-xl">|</p>
                <p className="my-4  text-xl">
                  {data.city}
                  {data.district}
                  {data.address}
                </p>
              </div>
            </div>

            <div className="absolute right-8 top-2 flex h-16 w-24 items-center justify-between">
              <IconContext.Provider
                value={{ size: "50px", backgroundColor: "black" }}
              >
                <HiThumbDown />
              </IconContext.Provider>
              <p>Oh No!</p>
            </div>
          </div>
        );
      })
    ) : (
      <h1 key="no">未有相關資訊</h1>
    );

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold">不好吃的餐廳</h1>
      </div>
      <div>{companyDatas}</div>
    </>
  );
}

export default DislikeShop;
