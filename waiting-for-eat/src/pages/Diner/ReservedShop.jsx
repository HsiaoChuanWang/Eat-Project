import { Button, Card, ScrollShadow } from "@nextui-org/react";
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
import { IoMdPin } from "react-icons/io";
import { IoRestaurant } from "react-icons/io5";
import { PiPhoneCallFill } from "react-icons/pi";
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
          <Card
            key={data.orderId}
            className="mb-8 border-2 border-solid border-gray-800 shadow-[-8px_8px_4px_2px_rgba(0,0,0,0.2)]"
          >
            <div className="relative flex items-center">
              <div className="bg-amber-800/30 p-4">
                <div className="h-[150px] w-[300px] object-cover object-center">
                  <img
                    className="h-full w-full rounded-lg object-cover object-center"
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

                <div className="mt-1 flex items-center text-amber-900">
                  <PiPhoneCallFill className="mr-2 text-xl" />
                  <p className="text-lg font-bold">{data.phone}</p>
                </div>

                <div className="mt-1 flex items-center text-amber-900">
                  <IoMdPin className="mr-2 text-xl" />
                  <p className="text-lg font-bold">
                    {data.city}
                    {data.district}
                    {data.address}
                  </p>
                </div>
              </div>

              <div className=" ml-4">
                <div className="flex">
                  <p className="my-4  text-xl font-bold">用餐時間</p>
                  <p className="mx-4  my-4 text-xl font-bold">|</p>
                  <p className="my-4  text-xl">{data.date}</p>
                  <p className="my-4  ml-4 text-xl">{data.start}</p>
                </div>

                <div className="flex">
                  <p className="my-4  text-xl font-bold">訂位人數</p>
                  <p className="mx-4  my-4 text-xl font-bold">|</p>
                  <p className="my-4  text-xl">{data.people}</p>
                </div>

                <div className="flex items-center">
                  <p className="my-4  text-xl font-bold">排定桌號</p>
                  <p className="mx-4  my-4 text-xl font-bold">|</p>
                  {data.tableNumber.map((number) => {
                    return (
                      <div
                        key={number}
                        className="mx-2 flex h-10 w-12 items-center justify-center border-2 border-solid border-black font-bold"
                      >
                        {number}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="absolute right-4 top-4 flex h-10 w-28 items-center justify-center rounded-xl border border-solid bg-gray-200">
                <div className="flex items-center justify-center">
                  <div className="mr-1">
                    <IconContext.Provider value={{ size: "30px" }}>
                      <BiSolidBookmarkAlt />
                    </IconContext.Provider>
                  </div>
                  <p className="mr-1 font-bold">|</p>
                  <div>
                    <p className="font-black">已預約</p>
                  </div>
                </div>
              </div>

              <Button
                radius="full"
                className="absolute bottom-4 right-4 mt-6 block h-10 rounded-lg bg-[#b0aba5] px-4 text-center text-lg font-black text-white shadow-lg"
                onClick={() => handleDelete(data.orderId)}
              >
                取消
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
          <div className="w-full">{companyDatas}</div>
        </div>
      </ScrollShadow>
    </div>
  );
}

export default ReservedShop;
