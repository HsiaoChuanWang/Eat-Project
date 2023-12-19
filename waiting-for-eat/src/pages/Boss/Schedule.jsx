import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import { ScrollShadow } from "@nextui-org/react";
import { DatePicker } from "antd";
import dateFormat from "dateformat";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { default as React, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import db from "../../firebase";
import "./schedule.css";

function Schedule() {
  const [editable, setEditable] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const myRef = useRef();
  const { companyId } = useParams();
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [updateOrders, setUpdateOrders] = useState([]);
  const [finalUpdateOrders, setFinalUpdateOrders] = useState([]);
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
    getDocs(tableRef).then((result) => {
      let seats = [];
      result.forEach((doc) => {
        const data = doc.data();
        const dataId = doc.id;
        const combine = { ...data, tableId: dataId };
        seats.push(combine);
      });
      setTables(seats);
    });

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
              setOrders([...combineOrder]);
            });
        });
      });

    const tableSnap = onSnapshot(tableRef, (querySnapshot) => {
      let seats = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const dataId = doc.id;
        const combine = { ...data, tableId: dataId };
        seats.push(combine);
      });
      setTables(seats);
    });

    const orderSnap = onSnapshot(orderq, (querySnapshot) => {
      let orderList = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const dataId = doc.id;
        const combine = { ...data, orderId: dataId };
        orderList.push(combine);
      });

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
            setOrders([...combineOrder]);
          });
      });
    });

    return tableSnap, orderSnap;
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
  orders.map((order) => {
    order.tableNumber.map((orderTableNumber) => {
      events.push({
        title:
          order.userName +
          "\n" +
          order.phone +
          "\n" +
          order.remark +
          "$" +
          order.people +
          "$" +
          order.orderId +
          "$" +
          order.userId +
          "$" +
          order.attend,
        start: new Date(order.date + " " + order.start),
        end: new Date(order.date + " " + order.end),
        id: order.orderId + "$" + orderTableNumber,
        resourceId: orderTableNumber,
        display: "auto",
        color: "#e0effc",
        //   constraints: "businessHours",//限制時段
      });
    });
  });

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
    const startTime = dateFormat(info.event.start, "HH:MM");
    const endDay = dateFormat(info.event.end, "yyyy/mm/dd");
    const endTime = dateFormat(info.event.end, "HH:MM");
    const eventID = info.event.id;
    const idSplit = info.event.id.split("$");
    const orderId = idSplit[0];
    const oldTableNumber = idSplit[1];
    const newtableNumber = info.event._def.resourceIds[0];

    let updateOrder = updateOrders.find((p) => p.eventID == eventID);

    if (updateOrder == undefined) {
      let order = orders.find((p) => p.orderId == orderId);
      let orderTableNumber = order.tableNumber;
      const tableNumberIndex = orderTableNumber.indexOf(oldTableNumber);
      if (tableNumberIndex != -1) {
        updateOrder = {
          eventID: eventID,
          start: startTime,
          end: endTime,
          orderId: orderId,
          newtableNumber: newtableNumber,
          tableNumberIndex: tableNumberIndex,
        };
        updateOrders.push(updateOrder); //撈到移動的資料
      }
    } else {
      updateOrder.start = startTime;
      updateOrder.end = endTime;
      updateOrder.newtableNumber = newtableNumber;
    }
    // alert(
    //   "ID: " +
    //     orderId +
    //     "\n桌號: " +
    //     newtableNumber +
    //     "\n開始: " +
    //     startDay +
    //     " " +
    //     startTime +
    //     "\n結束: " +
    //     endDay +
    //     " " +
    //     endTime,
    // );
  }

  //datePicker選用時間
  function changeStartDate(date, dateString) {
    if (date != null) myRef.current.getApi().gotoDate(dateString);
  }

  async function updateFirestore(finalUpdateOrders) {
    console.log(finalUpdateOrders.orderId);
    const orderRef = doc(db, "order", finalUpdateOrders.orderId);

    await updateDoc(orderRef, {
      start: finalUpdateOrders.start,
      end: finalUpdateOrders.end,
      tableNumber: finalUpdateOrders.tableNumber,
    });
  }

  function save(e) {
    setFinalUpdateOrders([]);
    //改原本的值orders，updateOrders是有改過的所有訂單(但同一筆訂單可能有兩個component)
    updateOrders.forEach((updateOrder) => {
      let order = orders.find((p) => p.orderId == updateOrder.orderId);
      order.start = updateOrder.start;
      order.end = updateOrder.end;
      let orderTableNumber = order.tableNumber;
      orderTableNumber[updateOrder.tableNumberIndex] =
        updateOrder.newtableNumber;

      //上傳有被移動的結果(同一筆訂單的component合併成一個訂單)
      let finalUpdateOrder = finalUpdateOrders.find(
        (p) => p.orderId == updateOrder.orderId,
      );
      if (finalUpdateOrder == undefined) {
        finalUpdateOrders.push(order);
      } else {
        finalUpdateOrder = order;
      }
    });

    finalUpdateOrders.forEach((item) => {
      updateFirestore(item);
    });

    setUpdateOrders([]);
    setEditable(false);
    setIsSelected(false);
  }

  async function AddFavorite(orderId, userId) {
    await setDoc(doc(db, "favorite", orderId), {
      orderId: orderId,
      userId: userId,
      companyId: companyId,
      status: "eaten",
      postId: "",
    });
  }

  async function DeleteOrder(orderId) {
    await deleteDoc(doc(db, "order", orderId));
  }

  async function UpdateAttend(orderId) {
    const OrderRef = doc(db, "order", orderId);
    await updateDoc(OrderRef, {
      attend: "yes",
    });
  }

  //自製event的格式
  function eventContent(arg) {
    let stringArray = arg.event.title.split("$");
    let titleArray = stringArray[0].split("\n");
    let name = titleArray[0];
    let tel = titleArray[1];
    let remark = titleArray[2];
    let people = stringArray[1];
    let orderId = stringArray[2];
    let userId = stringArray[3];
    let attend = stringArray[4];

    return (
      <div className="flex justify-between border">
        <div className="ml-2 mt-4 text-base font-bold text-black">
          {name}
          <br />
          {tel}
        </div>

        <div className="flex w-[80px] items-center justify-center ">
          <div className="flex h-[60px] w-[60px] items-center justify-center rounded bg-[#8ba9ee] text-center">
            <h1> {people}人</h1>
          </div>
        </div>

        {/* <div>
          <button className={` h-8 border-2 border-solid border-black `}>
            已出席
          </button>
        </div> */}

        <div>
          <div>
            <button
              className={`my-1 mr-4 h-8 rounded	bg-[#082567] px-2 ${
                attend === "no" && "cursor-pointer"
              }`}
              onClick={() => {
                if (editable === true) {
                  AddFavorite(orderId, userId);
                  UpdateAttend(orderId);
                }
              }}
              disabled={attend === "yes"}
            >
              {attend === "no" ? "入席" : "已出席"}
            </button>
          </div>

          <div>
            <button
              className={`absolute h-8 cursor-pointer rounded bg-gray-400 px-2 ${
                attend === "yes" && "hidden"
              } `}
              onClick={() => {
                DeleteOrder(orderId);
              }}
              disabled={attend === "yes"}
            >
              取消
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center ">
      <div className="mt-8 w-5/6">
        <div>
          <button
            onClick={() => {
              setEditable(true);
              setIsSelected(true);
            }}
            className={`${
              isSelected === true && "bg-gray-300"
            } absolute right-[282px] top-[105px] z-10 rounded bg-[#ff850e] px-4 py-2 font-semibold text-white hover:opacity-80`}
          >
            移動
          </button>

          <button
            onClick={save}
            className={`${
              isSelected === false && "bg-gray-300"
            } absolute right-[360px] top-[105px] z-10 rounded bg-[#ff850e] px-4 py-2 font-semibold text-white hover:opacity-80`}
          >
            保存
          </button>

          <div className="absolute right-[525px] top-[86px]">
            <h1 className="font-bold">選擇日期</h1>
            <DatePicker
              className="mb-4 border border-solid border-black"
              onChange={changeStartDate}
            />
          </div>
        </div>

        <div>
          <div className="h-[72px]"></div>

          <ScrollShadow
            size={0}
            hideScrollBar
            orientation="horizontal"
            className="flex h-[calc(100vh-300px)] w-[850px] justify-center"
          >
            <FullCalendar
              //   themeSystem="asd"
              resourceAreaWidth={150}
              contentHeight={"auto"}
              slotMinWidth={80} //欄位寬度
              height={"auto"}
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
          </ScrollShadow>
        </div>
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
