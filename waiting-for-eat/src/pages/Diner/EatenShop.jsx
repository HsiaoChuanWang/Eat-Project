import { Button, Card, ScrollShadow } from "@nextui-org/react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
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
import { IoMdPin } from "react-icons/io";
import { IoRestaurant } from "react-icons/io5";
import { PiPhoneCallFill } from "react-icons/pi";
import { useNavigate, useParams } from "react-router-dom";
import db from "../../firebase";
import useStarStore from "../../stores/starStore";

function EatenShop() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [combineData, setCombineData] = useState([]);
  const setCompanyName = useStarStore((state) => state.setCompanyName);
  const setCompanyId = useStarStore((state) => state.setCompanyId);
  const setOrderId = useStarStore((state) => state.setOrderId);
  const favoriteq = query(
    collection(db, "favorite"),
    where("userId", "==", userId),
    where("postId", "==", ""),
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

  async function handleSend() {
    const starRef = await addDoc(collection(db, "star"), {
      orderId: orderId,
      companyId: companyId,
      userId: userId,
      star: star,
      content: content,
      createTime: serverTimestamp(),
    });
  }

  const favoriteState = (favoriteId, status) => {
    switch (status) {
      case "like":
        return (
          <div className="flex h-10 w-28 items-center justify-center rounded-xl border border-solid bg-gray-200">
            <div className="mr-1">
              <IconContext.Provider value={{ size: "30px" }}>
                <HiThumbUp
                  className="cursor-pointer"
                  onClick={() => handleLike(favoriteId, "eaten")}
                />
              </IconContext.Provider>
            </div>
            <p className="mr-1">|</p>
            <p className="font-semibold">Like</p>
          </div>
        );

      case "dislike":
        return (
          <div className="flex h-10 w-28 items-center justify-center rounded-xl border border-solid bg-gray-200">
            <div className="mr-1">
              <IconContext.Provider
                value={{ size: "30px", backgroundColor: "black" }}
              >
                <HiThumbDown
                  className="cursor-pointer"
                  onClick={(e) => handleLike(favoriteId, "eaten")}
                />
              </IconContext.Provider>
            </div>
            <p className="mr-1">|</p>
            <p className="font-semibold">Bad</p>
          </div>
        );

      case "eaten":
        return (
          <>
            <div className="flex h-10 w-28 items-center justify-center rounded-xl border border-solid bg-gray-200">
              <div className="flex items-center justify-center">
                <div className="mr-1">
                  <IconContext.Provider value={{ size: "30px" }}>
                    <HiOutlineThumbUp
                      className="cursor-pointer"
                      title="noLike"
                      onClick={(e) => handleLike(favoriteId, "like")}
                    />
                  </IconContext.Provider>
                </div>
                <p className="mr-1">|</p>
                <div>
                  <IconContext.Provider value={{ size: "30px" }}>
                    <HiOutlineThumbDown
                      className="cursor-pointer"
                      onClick={(e) => handleLike(favoriteId, "dislike")}
                    />
                  </IconContext.Provider>
                </div>
              </div>
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
            <Card
              key={data.favoriteId}
              className="mb-8 border-2 border-solid border-gray-800 shadow-[-8px_8px_4px_2px_rgba(0,0,0,0.2)]"
            >
              <div className="relative flex items-center">
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
                  {favoriteState(data.favoriteId, data.status)}
                </div>

                <div
                  className={` ${
                    data.canWriteComment === false && "hidden"
                  } absolute bottom-12 right-8 h-8 `}
                ></div>

                <div
                  className={` ${data.canWriteComment === false && "hidden"}`}
                >
                  <Button
                    onClick={() => {
                      setCompanyName(data.name);
                      setOrderId(data.orderId);
                      setCompanyId(data.companyId);
                      navigate(`/diner/addStar/${userId}`);
                    }}
                    className={` ${
                      data.canWriteComment === false && "hidden"
                    } absolute bottom-16 right-4 mt-6 block h-10 rounded-lg bg-[#ff850e] px-4 text-center text-lg font-black text-white shadow-lg`}
                  >
                    寫評論
                  </Button>
                </div>

                <div className={` ${data.canWritePost === false && "hidden"}`}>
                  <Button
                    onClick={() =>
                      navigate(`/diner/textEditor/${data.orderId}`)
                    }
                    className={` ${
                      data.canWritePost === false && "hidden"
                    } absolute bottom-4 right-4 mt-6 block h-10 rounded-lg bg-[#ff850e] px-4 text-center text-lg font-black text-white shadow-lg`}
                  >
                    寫食記
                  </Button>
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

export default EatenShop;
