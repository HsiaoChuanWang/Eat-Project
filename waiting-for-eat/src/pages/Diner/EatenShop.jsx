import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { IconContext } from "react-icons";
import {
  HiOutlineThumbDown,
  HiOutlineThumbUp,
  HiThumbDown,
  HiThumbUp,
} from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";
import db from "../../firebase";
import Star from "./Star";

function EatenShop() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [combineData, setCombineData] = useState([]);
  const favoriteq = query(
    collection(db, "favorite"),
    where("userId", "==", userId),
    where("postId", "==", ""),
  );
  const starq = query(collection(db, "star"), where("userId", "==", userId));

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

  async function getPostInfo(orderId) {
    const postq = query(
      collection(db, "post"),
      where("orderId", "==", orderId),
    );

    const querySnapshot = await getDocs(postq);
    let resultList = [];

    querySnapshot.forEach((doc) => {
      if (doc.exists()) {
        const result = false;
        resultList.push(result);
      } else {
        const result = true;
        resultList.push(result);
      }
    });

    if (resultList[0] == undefined) {
      return true;
    } else {
      return false;
    }
  }

  async function getCommentInfo(orderId) {
    const commentq = query(
      collection(db, "star"),
      where("orderId", "==", orderId),
    );

    const querySnapshot = await getDocs(commentq);
    let resultList = [];

    querySnapshot.forEach((doc) => {
      if (doc.exists()) {
        const result = false;
        resultList.push(result);
      } else {
        const result = true;
        resultList.push(result);
      }
    });

    if (resultList[0] == undefined) {
      return true;
    } else {
      return false;
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

      let combineList = [];
      favoriteList.forEach((item) => {
        getCompanyInfo(item.companyId).then((data) => {
          const newItem = Object.assign(item, data);
          getPostInfo(newItem.orderId)
            .then((data) => {
              const newnewItem = { ...newItem, canWritePost: data };
              return newnewItem;
            })
            .then((newnewItem) => {
              getCommentInfo(newItem.orderId).then((data) => {
                const newnewnewItem = {
                  ...newnewItem,
                  canWriteComment: data,
                };
                combineList.push(newnewnewItem);
                setCombineData([...combineList]);
              });
            });
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

  const favoriteState = (favoriteId, status) => {
    switch (status) {
      case "like":
        return (
          <>
            <IconContext.Provider value={{ size: "50px" }}>
              <HiThumbUp onClick={() => handleLike(favoriteId, "eaten")} />
            </IconContext.Provider>
            <p>Like!</p>
          </>
        );

      case "dislike":
        return (
          <>
            <IconContext.Provider
              value={{ size: "50px", backgroundColor: "black" }}
            >
              <HiThumbDown onClick={(e) => handleLike(favoriteId, "eaten")} />
            </IconContext.Provider>
            <p>Oh No!</p>
          </>
        );

      case "eaten":
        return (
          <>
            <div className="flex">
              <IconContext.Provider value={{ size: "50px" }}>
                <HiOutlineThumbUp
                  title="noLike"
                  onClick={(e) => handleLike(favoriteId, "like")}
                />
              </IconContext.Provider>

              <IconContext.Provider value={{ size: "50px" }}>
                <HiOutlineThumbDown
                  onClick={(e) => handleLike(favoriteId, "dislike")}
                />
              </IconContext.Provider>
            </div>
          </>
        );
    }
  };

  const companyDatas =
    combineData.length > 0 ? (
      combineData
        .sort((a, b) => (a.favoriteId > b.favoriteId ? 1 : -1))
        .map((data) => {
          return (
            <div
              key={data.favoriteId}
              className="relative my-2 flex items-center border-2 border-solid border-black px-2"
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
                {favoriteState(data.favoriteId, data.status)}
              </div>

              <div
                className={` ${
                  data.canWriteComment === false && "hidden"
                } absolute bottom-12 right-8 h-8 `}
              >
                <Star
                  companyId={data.companyId}
                  orderId={data.orderId}
                  userId={data.userId}
                  companyName={data.name}
                />
              </div>

              <button
                onClick={() => navigate(`/diner/textEditor/${data.orderId}`)}
                className={` ${
                  data.canWritePost === false && "hidden"
                } absolute bottom-2 right-8 h-8 border-2 border-solid border-black`}
              >
                寫食記
              </button>
            </div>
          );
        })
    ) : (
      <h1 key="no">未有相關資訊</h1>
    );

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold">吃過的餐廳</h1>
      </div>
      <div>{companyDatas}</div>
    </>
  );
}

export default EatenShop;
