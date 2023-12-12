import { Button, Card } from "@nextui-org/react";
import { DatePicker, Form, Input } from "antd";
import dayjs from "dayjs";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { default as React, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import db from "../../firebase";
import useUserStore from "../../stores/userStore";

function Reserve() {
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState({});
  const [openTime, setOpenTime] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [isSelected, setIsSelected] = useState("");
  const userInfo = useUserStore((state) => state.userInfo);
  const { companyId } = useParams();
  const [send, setSend] = useState({
    companyId: companyId,
    userId: userInfo.userId,
    date: "",
    start: "",
    end: "",
    people: "",
    attend: "no",
    remark: "無",
  });
  const weekRef = useRef(null);
  const detailInfo = useUserStore((state) => state.detailInfo);
  const checkRef = useRef(false);
  const companyRef = collection(db, "company");
  const orderRef = collection(db, "order");
  const openTimeRef = query(collection(companyRef, companyId, "openTime"));
  const tableRef = query(collection(companyRef, companyId, "table"));
  const companyInfoRef = doc(db, "company", companyId);

  useEffect(() => {
    getDoc(companyInfoRef).then((result) => {
      const data = result.data();
      setCompanyData(data);
    });

    getDocs(openTimeRef).then((result) => {
      let openTimes = [];
      result.forEach((doc) => {
        const data = doc.data();
        const dataId = doc.id;
        const combine = { ...data, timeId: dataId };
        openTimes.push(combine);
      });
      setOpenTime(openTimes);
    });

    getDocs(tableRef).then((result) => {
      let tables = [];
      result.forEach((doc) => {
        const data = doc.data();
        const dataId = doc.id;
        const combine = { ...data, tableId: dataId };
        tables.push(combine);
      });
      setTables(tables);
    });
  }, []);

  useEffect(() => {
    if (userInfo.userId != "") {
      setSend({ ...send, userId: userInfo.userId });
    }
  }, [userInfo.userId]);

  //不能選今天之前的日期
  const disabledDate = (current) => {
    return current && current <= dayjs().subtract(1, "day").endOf("day");
  };

  async function updateData(send) {
    const orderRef = await addDoc(collection(db, "order"), send);
  }

  async function handleSend() {
    if (!Object.values(send).includes("")) {
      checkRef.current = false;

      //以orderq找出這間公司其指定時間已經被訂位的所有訂單
      let hasOrderArray = orders.filter((p) => p.start == send.start);
      let hasOrderTableNumberArray = [];

      //一個訂單可能有多個桌號，取出指定時間已經被訂位的桌號
      hasOrderArray.map((p) =>
        p.tableNumber.map((p) => hasOrderTableNumberArray.push(p)),
      );

      let canOrderArray = [];
      let orderTable = null;

      //確認可以訂的桌位
      tables.map((table) => {
        const hasOrder = hasOrderTableNumberArray.find(
          (p) => p == table.number,
        );
        if (hasOrder == undefined) canOrderArray.push(table);
      }); //沒有被訂的桌位就會undefined
      canOrderArray = canOrderArray.sort((firstItem, secondItem) =>
        firstItem.people > secondItem.people ? 1 : -1,
      ); //將table可容納的人數從小到大排列，資料中有id、number、people

      //人數剛好的桌子就分派給他
      orderTable = canOrderArray.find(
        (p) => parseInt(p.people) >= parseInt(send.people),
      );

      //如果沒有一個桌子的人數可以容納他定的人數，要訂兩張
      let tableNumbers = []; //最終桌號
      if (orderTable != null) {
        tableNumbers.push(orderTable.number);
      } else {
        let canOrderCount = [];
        let peopleCount = 0; //試著塞桌子後的總人數
        let orderList = [];

        //從桌位人數最小的開始塞，得到canOrderCount
        canOrderArray.map((canOrder) => {
          if (parseInt(send.people) > peopleCount) {
            canOrderCount.push(canOrder);
            peopleCount += parseInt(canOrder.people);
          }
        });

        //將canOrderCount從桌位人數大到小再排一次
        peopleCount = 0;
        canOrderCount.sort((firstItem, secondItem) =>
          firstItem.people < secondItem.people ? 1 : -1,
        );
        canOrderCount.map((canOrder) => {
          if (parseInt(send.people) > peopleCount) {
            orderList.push(canOrder);
            peopleCount += parseInt(canOrder.people);
          }
        });

        if (parseInt(send.people) > peopleCount) {
          alert("座位不足");
          return false;
        }

        //最終桌號
        orderList.forEach((table) => {
          const number = table.number;
          tableNumbers.push(number);
        });
      }
      send.tableNumber = tableNumbers;

      updateData(send);
      alert(`預約成功! 請確認訂位資訊，若有任何疑問請洽電。`);
      navigate(`/diner/reservedShop/${userInfo.userId}`);
      setIsSelected("");
    } else {
      alert("請填寫完整資訊");
    }
  }
  openTime.sort((firstItem, secondItem) =>
    firstItem.start > secondItem.start ? 1 : -1,
  );

  const timeList = openTime.map((time) => {
    let week = -1;
    switch (time.day) {
      case "星期日":
        week = 0;
        break;
      case "星期一":
        week = 1;
        break;
      case "星期二":
        week = 2;
        break;
      case "星期三":
        week = 3;
        break;
      case "星期四":
        week = 4;
        break;
      case "星期五":
        week = 5;
        break;
      case "星期六":
        week = 6;
        break;
    }
    if (weekRef.current == week) {
      let hasOrderArray = orders.filter((p) => p.start == time.start);
      let hasOrderTableNumberArray = [];
      hasOrderArray.map((p) =>
        p.tableNumber.map((p) => hasOrderTableNumberArray.push(p)),
      );
      let canOrderArray = [];
      tables.map((table) => {
        const hasOrder = hasOrderTableNumberArray.find(
          (p) => p == table.number,
        );
        if (hasOrder == undefined) canOrderArray.push(table);
      });

      if (canOrderArray.length > 0) {
        return (
          <div
            key={time.timeId}
            className={`mb-3 mr-3 h-10 w-24 cursor-pointer rounded border border-solid border-gray-400 text-center leading-[40px] text-gray-500 ${
              isSelected === time.timeId && "bg-[#ff850e]"
            }  ${isSelected === time.timeId && "text-white"}`}
            onClick={() => {
              setSend({ ...send, start: time.start, end: time.end });
              setIsSelected(time.timeId);
            }}
          >
            <div>{time.start}</div>
          </div>
        );
      }
    }
  });
  async function changeDate(e) {
    let date = null;
    if (e != null) date = e.$y + "/" + (e.$M + 1) + "/" + e.$D;
    const orderq = query(
      orderRef,
      where("companyId", "==", companyId),
      where("date", "==", date),
    );

    getDocs(orderq).then((result) => {
      let orderList = [];
      result.forEach((doc) => {
        const data = doc.data();
        const dataId = doc.id;
        const combine = { ...data, orderId: dataId };
        orderList.push(combine);
      });
      setOrders(orderList);
    });

    weekRef.current = e?.$W;
    setSend({ ...send, date: date });
  }

  return (
    <div className="flex justify-center">
      <div className="flex max-w-[1400px] justify-between">
        <div className="mt-44 w-4/12">
          <img
            src={companyData.picture}
            className=" max-h-[400px] w-full rounded-2xl object-cover object-center"
          ></img>

          <div className="py-4 pl-6">
            <h1 className="text-2xl font-black">{companyData.name}</h1>
            <h1 className="my-2 font-bold">
              {companyData.city}
              {companyData.district}
              {companyData.address}
            </h1>
            <h1 className="font-bold">{companyData.phone}</h1>
          </div>
        </div>

        <Card className="mt-20 w-7/12 border-2 border-solid border-gray-300">
          <div>
            <div className="flex justify-center">
              <h2 className="p-6 text-center text-3xl font-black">
                填寫訂位資訊
              </h2>
            </div>

            <div className="flex justify-center">
              <div className="mt-2">
                <div className="mx-6 mb-8 flex text-lg font-semibold">
                  <h1>姓名</h1>
                  <h1 className="mx-6">|</h1>
                  <h1>
                    {detailInfo.userName} {detailInfo.gender}
                  </h1>
                </div>

                <div className="mx-6 mb-8 flex text-lg font-semibold">
                  <h1>手機</h1>
                  <h1 className="mx-6">|</h1>
                  <h1>{detailInfo.phone}</h1>
                </div>

                <div className="mx-6 mb-2 flex items-baseline text-lg font-semibold">
                  <h1>人數</h1>
                  <h1 className="mx-6">|</h1>
                  <Form>
                    <Form.Item
                      rules={[
                        {
                          message: "請輸入人數!",
                        },
                      ]}
                    >
                      <Input
                        name="people"
                        className="h-10 w-20"
                        onChange={(e) =>
                          setSend({ ...send, people: e.target.value })
                        }
                        value={send.people}
                      />
                    </Form.Item>
                  </Form>
                  <h1 className="mx-2 text-lg font-semibold">人</h1>
                </div>

                <div className="mx-6 mb-8 flex items-baseline text-lg font-semibold">
                  <h1>日期</h1>
                  <h1 className="mx-6">|</h1>
                  <DatePicker
                    className="h-10 w-44"
                    disabledDate={disabledDate}
                    onChange={changeDate}
                    placeholder=""
                  />
                </div>

                <div className="mx-6 mb-4 flex text-lg font-semibold">
                  <h1>時間</h1>
                  <h1 className="mx-6">|</h1>
                  <div className="flex w-96 flex-wrap">
                    {timeList[0] === undefined ? (
                      <div
                        className={`mb-3 mr-3 h-10 w-36 rounded border border-solid border-gray-400 text-center leading-[40px] text-gray-500`}
                      >
                        <div>尚無可預約時段</div>
                      </div>
                    ) : (
                      timeList
                    )}
                  </div>
                </div>

                <div className="mx-6 mb-6 flex text-lg font-semibold">
                  <h1>備註</h1>
                  <h1 className="mx-6">|</h1>
                  <Form>
                    <Form.Item name="remark">
                      <Input
                        className="h-36 w-96"
                        name="remark"
                        onChange={(e) =>
                          setSend({ ...send, remark: e.target.value })
                        }
                        value={send.remark}
                      />
                    </Form.Item>
                  </Form>
                </div>

                <div className="mb-8 flex justify-end">
                  <Button
                    radius="full"
                    className="mr-8 block h-11 rounded-lg bg-[#b0aba5] px-4 text-center text-lg font-black text-white shadow-lg"
                    onClick={() => navigate(`/`)}
                  >
                    返回首頁
                  </Button>
                  <Button
                    radius="full"
                    className="block h-11 rounded-lg bg-[#ff850e] px-4 text-center text-lg font-black text-white shadow-lg"
                    onClick={handleSend}
                    disabled={checkRef.current}
                  >
                    確認訂位
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Reserve;
