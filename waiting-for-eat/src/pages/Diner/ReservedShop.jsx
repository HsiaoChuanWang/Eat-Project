import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { IconContext } from "react-icons";
import { BiSolidBookmarkAlt } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import db from "../../firebase";

function ReservedShop() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [orders, setOrders] = useState([]);
  const [combineData, setCombineData] = useState([]);
  const orderq = query(
    collection(db, "order"),
    where("userId", "==", userId),
    where("attend", "==", "no"),
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
    const orderSnap = onSnapshot(orderq, (result) => {
      let orderList = [];
      result.forEach((doc) => {
        const data = doc.data();
        const dataId = doc.id;
        const combine = { ...data, orderId: dataId };
        orderList.push(combine);
      });
      setOrders([...orderList]);

      let companyList = [];
      orderList.forEach((order) => {
        getCompanyInfo(order.companyId)
          .then((data) => {
            const newData = Object.assign(order, data);
            companyList.push(newData);
          })
          .then(() => {
            setCombineData([...companyList]);
          });
      });
    });

    return orderSnap;
  }, []);

  async function handleDelete(orderId) {
    await deleteDoc(doc(db, "order", orderId));
  }

  const companyDatas =
    combineData.length > 0 ? (
      combineData.map((data) => {
        return (
          <div
            key={data.orderId}
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

              <div className="flex">
                <p className="my-4  text-xl">用餐時間</p>
                <p className="mx-4  my-4 text-xl">|</p>
                <p className="my-4  text-xl">{data.date}</p>
                <p className="my-4  ml-4 text-xl">{data.start}</p>
              </div>

              <div className="flex">
                <p className="my-4  text-xl">訂位人數</p>
                <p className="mx-4  my-4 text-xl">|</p>
                <p className="my-4  text-xl">{data.people}</p>
              </div>

              <div className="flex">
                <p className="my-4  text-xl">桌號</p>
                <p className="mx-4  my-4 text-xl">|</p>
                {data.tableNumber.map((number) => {
                  return (
                    <div
                      key={number}
                      className="mx-2 flex h-10 w-12 items-center justify-center border-2 border-solid border-black "
                    >
                      {number}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="absolute right-8 top-2 flex h-16 w-24 items-center justify-between">
              <IconContext.Provider value={{ size: "36px" }}>
                <BiSolidBookmarkAlt />
              </IconContext.Provider>
              <p>已預約</p>
            </div>

            <button
              onClick={() => handleDelete(data.orderId)}
              className="absolute bottom-2 right-8 h-8 border-2 border-solid border-black"
            >
              取消
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
        <h1 className="text-2xl font-bold">已預約餐廳</h1>
      </div>
      <div>{companyDatas}</div>
    </>
  );
}

export default ReservedShop;
