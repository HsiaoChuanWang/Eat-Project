import { Button, DatePicker, Form, Input } from "antd";
import { collection, getDocs, query, where } from "firebase/firestore";
import { default as React, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import db from "../../firebase";
import useUserStore from "../../stores/userStore";

function Reserve() {
  const [userData, setUserData] = useState({});
  const [openTime, setOpenTime] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
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
  });
  const weekRef = useRef(null);
  const detailInfo = useUserStore((state) => state.detailInfo);
  const checkRef = useRef(false);
  const companyRef = collection(db, "company");
  const orderRef = collection(db, "order");
  const openTimeRef = query(collection(companyRef, companyId, "openTime"));
  const tableRef = query(collection(companyRef, companyId, "table"));

  useEffect(() => {
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

  async function handleSend() {
    console.log(send);
    if (!Object.values(send).includes("")) {
      checkRef.current = false;
      let hasOrderArray = orders.filter((p) => p.start == send.start);
      let hasOrderTableNumberArray = [];

      hasOrderArray.map((p) =>
        p.tableNumber.map((p) => hasOrderTableNumberArray.push(p)),
      );
      console.log(hasOrderTableNumberArray);

      let canOrderArray = [];
      let orderTable = null;

      tables.map((table) => {
        const hasOrder = hasOrderTableNumberArray.find(
          (p) => p == table.number,
        );
        console.log("hasOrder");
        console.log(table);
        console.log(hasOrder);
        if (hasOrder == undefined) canOrderArray.push(table);
      });
      canOrderArray = canOrderArray.sort((firstItem, secondItem) =>
        firstItem.people > secondItem.people ? 1 : -1,
      );
      console.log(canOrderArray);
      console.log(orderTable);
      orderTable = canOrderArray.find(
        (p) => parseInt(p.people) >= parseInt(send.people),
      );
      console.log(orderTable);
      if (orderTable != null) {
        send.tableNumber = orderTable.number;
      } else {
        let canOrderCount = [];
        let peopleCount = 0;
        let orderList = [];
        canOrderArray.map((canOrder) => {
          if (parseInt(send.people) > peopleCount) {
            canOrderCount.push(canOrder);
            peopleCount += parseInt(canOrder.people);
          }
        });
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
        console.log(orderList);
        let tableNumbers = [];
        orderList.forEach((table) => {
          const number = table.number;
          tableNumbers.push(number);
        });
        console.log(tableNumbers);
        setSend({ ...send, tableNumber: tableNumbers });
      }
      console.log(send);
    } else {
      alert("請填寫完整資訊");
    }
  }
  console.log(send);

  const timeList = openTime.map((time) => {
    // console.log(time);
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
      if (canOrderArray.length > 0)
        return (
          <div
            key={time.timeId}
            className="mx-4 h-12 w-20 border-2 border-solid border-black"
            onClick={() => {
              setSend({ ...send, start: time.start, end: time.end });
            }}
          >
            <div>{time.start}</div>
          </div>
        );
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
    <>
      <h2 className="p-6 text-center text-xl">預約資訊</h2>
      <div className="mx-6 flex">
        <h1>姓名</h1>
        <h1 className="mx-6">|</h1>
        <h1>
          {detailInfo.userName} {detailInfo.gender}
        </h1>
      </div>
      <div className="mx-6 flex">
        <h1>手機</h1>
        <h1 className="mx-6">|</h1>
        <h1>{detailInfo.phone}</h1>
      </div>
      <div className="mx-6 flex">
        <h1>人數</h1>
        <h1 className="mx-6">|</h1>
        <Form>
          <Form.Item
            name="people"
            rules={[
              {
                message: "請輸入人數!",
              },
            ]}
          >
            <Input
              name="people"
              onChange={(e) => setSend({ ...send, people: e.target.value })}
              value={send.people}
            />
          </Form.Item>
        </Form>
        <h1>人</h1>
      </div>
      <div className="mx-6 flex">
        <h1>日期</h1>
        <h1 className="mx-6">|</h1>
        <DatePicker onChange={changeDate} />
      </div>

      <div className="mx-6 flex">
        <h1>時間</h1>
        <h1 className="mx-6">|</h1>
        {timeList}
      </div>
      <div className="mx-6 flex">
        <h1>備註</h1>
        <h1 className="mx-6">|</h1>
        <Form>
          <Form.Item name="remark">
            <Input
              name="remark"
              onChange={(e) => setSend({ ...send, remark: e.target.value })}
              value={send.remark}
            />
          </Form.Item>
        </Form>
      </div>
      <Button
        className="bg-[#1677ff]"
        onClick={handleSend}
        disabled={checkRef.current}
        type="primary"
        htmlType="button"
      >
        Submit
      </Button>
    </>
  );
}

export default Reserve;
