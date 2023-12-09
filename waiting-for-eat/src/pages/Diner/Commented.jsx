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
            <div
              key={data.starId}
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
                  <p className="my-4  text-xl">用餐時間</p>
                  <p className="mx-4  my-4 text-xl">|</p>
                  <p className="my-4  text-xl">{data.date}</p>
                  <p className="my-4  ml-4 text-xl">{data.start}</p>
                </div>

                <div className="flex">
                  <p className="my-4  text-xl">餐廳名稱</p>
                  <p className="mx-4  my-4 text-xl">|</p>
                  <p className="my-4  text-xl">{data.name}</p>
                </div>

                <div className="flex">
                  <Rate disabled defaultValue={data.star} />
                </div>

                <div className="flex">
                  <p className="my-4  text-xl">撰寫時間</p>
                  <p className="mx-4  my-4 text-xl">|</p>
                  <p className="my-4  text-xl">
                    {dateFormat(data.createTime.toDate(), "yyyy/mm/dd HH:MM")}
                  </p>
                </div>

                <div className="flex">
                  <p className="my-4  text-xl">評論內容</p>
                  <p className="mx-4  my-4 text-xl">|</p>
                  <p className="my-4  text-xl">{data.content}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setCompanyId(data.companyId);
                  setCompanyName(data.name);
                  setStarId(data.starId);
                  navigate(`/diner/starEdit/${userId}`);
                }}
                className="absolute bottom-12 right-8 h-8 border-2 border-solid border-black"
              >
                編輯
              </button>

              <button
                onClick={() => {
                  handleDelete(data.starId, data.companyId);
                }}
                className="absolute bottom-2 right-8 h-8 border-2 border-solid border-black"
              >
                刪除
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
        <h1 className="text-2xl font-bold">我的評論</h1>
      </div>
      <div>{printDatas}</div>
    </>
  );
}

export default Commented;
