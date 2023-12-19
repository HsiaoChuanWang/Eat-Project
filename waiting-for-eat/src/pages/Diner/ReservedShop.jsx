import { Button, Card, ScrollShadow, Spinner } from "@nextui-org/react";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { motion } from "framer-motion";
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
      combineData.map((data, i) => {
        return (
          <motion.div
            animate={{ x: 0, opacity: 1, transition: { delay: 0.1 * i } }}
            initial={{ x: -50, opacity: 0 }}
            key={data.orderId}
          >
            <Card className="border-2 shadow-xl">
              <div className="relative flex items-center">
                <div className="bg-amber-800/30 p-4 py-6">
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
                  <div className="mt-6 flex">
                    <p className="text-xl font-bold">用餐時間</p>
                    <p className="mx-4 text-xl font-bold">|</p>
                    <p className="text-xl">{data.date}</p>
                    <p className="ml-4 text-xl">{data.start}</p>
                  </div>

                  <div className="mt-6 flex">
                    <p className="text-xl font-bold">訂位人數</p>
                    <p className="mx-4 text-xl font-bold">|</p>
                    <p className="text-xl">{data.people}</p>
                  </div>

                  <div className="mt-6 flex items-center">
                    <p className="text-xl font-bold">排定桌號</p>
                    <p className="mx-4 text-xl font-bold">|</p>
                    {data.tableNumber.map((number) => {
                      return (
                        <div
                          key={number}
                          className="flex h-10 w-12 items-center justify-center bg-[#ff850e] font-bold text-white"
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
          </motion.div>
        );
      })
    ) : (
      <div key="no" className=" flex h-full justify-center">
        <Spinner
          label="加載中"
          color="warning"
          labelColor="warning"
          className="font-black"
          size="lg"
        />
      </div>
    );

  return (
    <div className="justify-cente flex h-full items-center">
      <ScrollShadow
        size={0}
        hideScrollBar
        className="flex h-[calc(100vh-300px)] w-full justify-center"
      >
        <div className="flex h-full w-3/4 flex-col gap-12">{companyDatas}</div>
      </ScrollShadow>
    </div>
  );
}

export default ReservedShop;
