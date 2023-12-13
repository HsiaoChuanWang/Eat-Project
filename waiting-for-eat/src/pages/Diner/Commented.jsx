import { Button, Card, ScrollShadow } from "@nextui-org/react";
import { Rate } from "antd";
import dateFormat from "dateformat";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FaPenToSquare } from "react-icons/fa6";
import { IoRestaurant, IoTimeSharp } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import db from "../../firebase";
import useStarStore from "../../stores/starStore";

function Commented() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [combineData, setCombineData] = useState([]);
  const [starArray, setStarArray] = useState([]);
  const starq = query(collection(db, "star"), where("userId", "==", userId));
  const setStarId = useStarStore((state) => state.setStarId);
  const setCompanyName = useStarStore((state) => state.setCompanyName);
  const setCompanyId = useStarStore((state) => state.setCompanyId);

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

  async function getOrderInfo(orderId) {
    const docRef = doc(db, "order", orderId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const resultUser = docSnap.data();
      return resultUser;
    } else {
      console.log("No such comment companyInfo document!");
    }
  }

  useEffect(() => {
    const starSnap = onSnapshot(starq, (result) => {
      let starList = [];
      result.forEach((doc) => {
        const data = doc.data();
        const dataId = doc.id;
        const combine = { ...data, starId: dataId };
        starList.push(combine);
      });

      let orderList = [];
      starList.forEach((item) => {
        getCompanyInfo(item.companyId).then((data) => {
          const newItem = Object.assign(item, data);
          getOrderInfo(newItem.orderId).then((data) => {
            const newnewItem = Object.assign(newItem, data);
            orderList.push(newnewItem);
            setCombineData([...orderList]);
          });
        });
      });
    });

    return starSnap;
  }, []);

  async function getStarArray(companyId) {
    const starq = query(
      collection(db, "star"),
      where("companyId", "==", companyId),
    );

    let starList = [];
    await getDocs(starq).then((result) => {
      result.forEach((doc) => {
        const result = doc.data();
        const resultStar = result.star;
        const resultId = doc.id;
        const combine = { ...result, starId: resultId };
        starList.push(resultStar);
      });
      setStarArray(starList);
    });
  }

  async function UpdateTotalStar(companyId) {
    await getStarArray(companyId);

    const sumStar = starArray.reduce((a, c) => a + c, 0);
    let avg;
    if (sumStar === 0) {
      avg = 0;
    } else {
      avg = sumStar / starArray.length;
    }

    const companyRef = doc(db, "company", companyId);
    await updateDoc(companyRef, {
      totalStar: avg,
    });
  }

  async function handleDelete(starId, companyId) {
    await deleteDoc(doc(db, "star", starId));

    UpdateTotalStar(companyId);
  }

  const printDatas =
    combineData.length > 0 ? (
      combineData
        .sort((a, b) => (a.createTime > b.createTime ? -1 : 1))
        .map((data) => {
          return (
            <Card
              key={data.starId}
              className="mb-8 border-2 border-solid border-gray-800 shadow-[-8px_8px_4px_2px_rgba(0,0,0,0.2)]"
            >
              <div className="relative flex items-center ">
                <div className="bg-amber-800/30 py-10 pl-6 pr-10">
                  <div className="flex h-40 w-64 items-center justify-center">
                    <img
                      className="h-full w-full cursor-pointer rounded-lg object-cover object-center"
                      src={data.picture}
                      onClick={() => {
                        navigate(`/restaurant/${data.companyId}`);
                      }}
                    />
                  </div>

                  <div className="mt-4 flex items-center text-amber-900">
                    <IoRestaurant className="mr-2 text-xl" />
                    <p className="text-lg font-bold">{data.name}</p>
                  </div>

                  <div className="flex items-center text-amber-900">
                    <IoTimeSharp className="mr-2 text-2xl" />
                    <p className="text-lg font-bold">{data.date}</p>
                    <p className="my-2  ml-2 text-lg  font-bold">
                      {data.start}
                    </p>
                  </div>
                </div>

                <div className="ml-4">
                  <div className="mb-4 flex items-center">
                    <FaPenToSquare className="mr-2 text-2xl" />
                    <p className="mr-2 text-lg font-bold">
                      {dateFormat(data.createTime.toDate(), "yyyy/mm/dd")}
                    </p>
                    <p className="text-lg font-bold">
                      {dateFormat(data.createTime.toDate(), "HH:MM")}
                    </p>
                  </div>

                  <div className="flex">
                    <Rate
                      className="text-2xl"
                      disabled
                      defaultValue={data.star}
                    />
                  </div>

                  <div className="mr-28">
                    <p className="my-4 text-xl">{data.content}</p>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setCompanyId(data.companyId);
                    setCompanyName(data.name);
                    setStarId(data.starId);
                    navigate(`/diner/starEdit/${userId}`);
                  }}
                  className="absolute bottom-16 right-4 mt-6 block h-10 rounded-lg bg-[#ff850e] px-4 text-center text-lg font-black text-white shadow-lg"
                >
                  編輯
                </Button>

                <Button
                  onClick={() => {
                    handleDelete(data.starId, data.companyId);
                  }}
                  className="absolute bottom-4 right-4 mt-6 block h-10 rounded-lg bg-[#b0aba5] px-4 text-center text-lg font-black text-white shadow-lg"
                >
                  刪除
                </Button>
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
          <div className="w-full">{printDatas}</div>
        </div>
      </ScrollShadow>
    </div>
  );
}

export default Commented;
