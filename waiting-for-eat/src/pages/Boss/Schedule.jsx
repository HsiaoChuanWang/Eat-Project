import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import { DatePicker } from "antd";
import dateFormat from "dateformat";
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
import { default as React, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import db from "../../firebase";
import "./schedule.css";

function Schedule() {
  const [editable, setEditable] = useState(false);
  const myRef = useRef();
  const { companyId } = useParams();
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const companyRef = collection(db, "company");
  const tableRef = query(collection(companyRef, companyId, "table"));
  const orderRef = query(collection(db, "order"));
  const orderq = query(orderRef, where("companyId", "==", companyId));

  async function getUserInfo(userId) {
    const docRef = doc(db, "user", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const resultUser = docSnap.data();
      return resultUser;
    } else {
      console.log("No such comment userInfo document!");
    }
  }

  useEffect(() => {
    // getDocs(tableRef).then((result) => {
    //   let seats = [];
    //   result.forEach((doc) => {
    //     const data = doc.data();
    //     const dataId = doc.id;
    //     const combine = { ...data, tableId: dataId };
    //     seats.push(combine);
    //   });
    //   setTables(seats);
    // });

    getDocs(orderq)
      .then((result) => {
        let orderList = [];
        result.forEach((doc) => {
          const data = doc.data();
          const dataId = doc.id;
          const combine = { ...data, orderId: dataId };
          orderList.push(combine);
        });
        return orderList;
      })
      .then((orderList) => {
        let combineOrder = [];
        orderList.forEach((order) => {
          getUserInfo(order.userId)
            .then((data) => {
              const newData = {
                ...order,
                userName: data.userName,
                phone: data.phone,
              };
              combineOrder.push(newData);
            })
            .then(() => {
              setOrders(combineOrder);
            });
        });
      });

    onSnapshot(tableRef, (querySnapshot) => {
      let seats = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const dataId = doc.id;
        const combine = { ...data, tableId: dataId };
        seats.push(combine);
      });
      setTables(seats);
    });

    onSnapshot(orderq, (querySnapshot) => {
      let orderList = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const dataId = doc.id;
        const combine = { ...data, tableId: dataId };
        orderList.push(combine);
      });
      setOrders(orderList);
    });
  }, []);

  //左邊列表
  let resources = [];
  tables.map((table) => {
    resources.push({
      id: table.number,
      title: table.number + " (" + table.people + "人桌)",
    });
  });
  resources = resources.sort((firstItem, secondItem) =>
    firstItem.id > secondItem.id ? 1 : -1,
  );

  //新增事件，一筆訂單可能有兩個以上的桌號
  let events = [];
  console.log("orders");
  console.log(orders);
  orders.map((order) => {
    order.tableNumber.map((orderTableNumber) => {
      events.push({
        title:
          "Name : " +
          order.userName +
          "\nTel : " +
          order.phone +
          "\n備註 : " +
          order.remark +
          "$" +
          order.people,
        start: new Date(order.date + " " + order.start),
        end: new Date(order.date + " " + order.end),
        id: order.orderId + orderTableNumber,
        resourceId: orderTableNumber,
        display: "auto",
        color: "#ff9f89",
        //   constraints: "businessHours",//限制時段
      });
    });
  });

  console.log(events);

  //拖曳事件
  //更新
  async function updateOrder(orderId, tableNumber, startTime, endTime) {
    const OrderRef = doc(db, "order", orderId);
    await updateDoc(OrderRef, {
      tableNumber: tableNumber,
      start: startTime,
      end: endTime,
    });
  }
  //取得指定order資料
  async function getOrder(orderId) {
    const docRef = doc(db, "order", orderId);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    const oldTableNumber = data.tableNumber;
  }

  function MyDropEvent(info) {
    const startDay = dateFormat(info.event.start, "yyyy/mm/dd");
    const startTime = dateFormat(info.event.start, "HH:ss");
    const endDay = dateFormat(info.event.end, "yyyy/mm/dd");
    const endTime = dateFormat(info.event.end, "HH:ss");
    const orderId = info.event.id;
    const tableNumber = info.event._def.resourceIds[0];

    alert(
      "ID: " +
        orderId +
        "\n桌號: " +
        tableNumber +
        "\n開始: " +
        startDay +
        " " +
        startTime +
        "\n結束: " +
        endDay +
        " " +
        endTime,
    );
  }

  //datePicker選用時間
  function changeStartDate(date, dateString) {
    if (date != null) myRef.current.getApi().gotoDate(dateString);
  }

  //自製event的格式
  function eventContent(arg) {
    let stringArray = arg.event.title.split("$");
    let titleArray = stringArray[0].split("\n");
    let name = titleArray[0];
    let tel = titleArray[1];
    let remark = titleArray[2];
    let people = stringArray[1];

    return (
      <div className="flex justify-between">
        <div>
          {name}
          <br />
          {tel}
          <br />
          {remark}
        </div>

        <div className="py-8">{people}人</div>

        <div>
          <div>
            <button
              className="my-1 h-8 border-2 border-solid border-black"
              onClick={() => {
                console.log("test");
              }}
            >
              保留
            </button>
          </div>

          <div>
            <button
              className="h-8 border-2 border-solid border-black"
              onClick={() => {
                console.log("test");
              }}
            >
              取消
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <button
          onClick={() => {
            setEditable(true);
          }}
          className="absolute right-0 border-2 border-solid border-black"
        >
          編輯
        </button>

        <button
          onClick={() => {
            setEditable(false);
          }}
          className="absolute right-16 border-2 border-solid border-black"
        >
          保存
        </button>
      </div>
      <div className="pt-20">
        <DatePicker onChange={changeStartDate} />
        <FullCalendar
          //   themeSystem="asd"
          resourceAreaWidth={150}
          contentHeight={"auto"}
          slotMinWidth={100} //欄位寬度
          height={100}
          ref={myRef}
          schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
          plugins={[resourceTimelinePlugin, interactionPlugin]}
          initialView="resourceTimeline"
          //   selectable={true}
          editable={editable}
          events={events}
          eventContent={eventContent}
          eventDrop={MyDropEvent}
          //   dateClick={MyAddEvent}
          //   eventClick={MyEventClick}
          resources={resources}
          resourceAreaHeaderContent={"桌位/時間"} //title名
        />
      </div>
    </div>
  );
}

export default Schedule;

//   function MyAddEvent(e) {
//     console.log(e.resource.id);
//     var event1 = {
//       title: "MyEvent",
//       start: e.date,
//       id: "a",
//       resourceId: e.resource.id,
//       display: "auto",
//       title: "Auditorium A",
//       color: "#ff9f89",
//     };
//     myRef.current.getApi().addEvent(event1);
//   }

//   function MyEventClick(info) {
//     console.log(info.view);
//     console.log(info);
//     console.log(info.el.fcSeg);
//     const startDay = dateFormat(info.event.start, "yyyy/mm/dd");
//     const startTime = dateFormat(info.event.start, "HH:ss");
//     const endDay = dateFormat(info.event.end, "yyyy/mm/dd");
//     const endTime = dateFormat(info.event.end, "HH:ss");
//     alert(startDay + " " + startTime + " - " + endDay + " " + endTime);
//   }
