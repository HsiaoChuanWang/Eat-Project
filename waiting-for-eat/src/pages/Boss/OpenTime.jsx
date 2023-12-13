import { Button, Card, ScrollShadow } from "@nextui-org/react";
import { Form, Select, TimePicker } from "antd";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
} from "firebase/firestore";
import { default as React, useEffect, useState } from "react";
import { BsDashLg } from "react-icons/bs";
import { FaTrashCan } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import db from "../../firebase";
import "./openTime.css";

function OpenTime() {
  const { companyId } = useParams();
  const [openTime, setOpenTime] = useState([]);
  const [addTime, setAddTime] = useState({ day: "", start: "", end: "" });
  const companyRef = collection(db, "company");
  const openTimeRef = query(collection(companyRef, companyId, "openTime"));
  const format = "HH:mm";

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

    onSnapshot(openTimeRef, (querySnapshot) => {
      let openTimes = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const dataId = doc.id;
        const combine = { ...data, timeId: dataId };
        openTimes.push(combine);
      });
      setOpenTime(openTimes);
    });
  }, []);

  function compareTime(a, b) {
    if (a.start < b.start) {
      return -1;
    }
    if (a.start > b.start) {
      return 1;
    }
    return 0;
  }

  function dayFilter(day) {
    const result = openTime.filter((obj) => obj.day === day);
    result.sort(compareTime);
    return result;
  }

  const Mon = dayFilter("星期一");
  const Tue = dayFilter("星期二");
  const Wed = dayFilter("星期三");
  const Thr = dayFilter("星期四");
  const Fri = dayFilter("星期五");
  const Sat = dayFilter("星期六");
  const Sun = dayFilter("星期日");

  const sortedTime = Mon.concat(Tue)
    .concat(Wed)
    .concat(Thr)
    .concat(Fri)
    .concat(Sat)
    .concat(Sun);

  const MonList = Mon.map((item) => {
    return (
      <div key={item.timeId} className="flex items-baseline">
        <h1 className="mx-4">{item.start}</h1>
        <BsDashLg className="mt-2" />
        <h1 className="mx-4">{item.end}</h1>
        <FaTrashCan
          className="mt-4"
          onClick={() => handleDelete(item.timeId)}
        />
      </div>
    );
  });
  const TueList = Tue.map((item) => {
    return (
      <div key={item.timeId} className="flex items-baseline">
        <h1 className="mx-4">{item.start}</h1>
        <BsDashLg className="mt-2" />
        <h1 className="mx-4">{item.end}</h1>
        <FaTrashCan
          className="mt-4"
          onClick={() => handleDelete(item.timeId)}
        />
      </div>
    );
  });

  const WedList = Wed.map((item) => {
    return (
      <div key={item.timeId} className="flex items-baseline">
        <h1 className="mx-4">{item.start}</h1>
        <BsDashLg className="mt-2" />
        <h1 className="mx-4">{item.end}</h1>
        <FaTrashCan
          className="mt-4"
          onClick={() => handleDelete(item.timeId)}
        />
      </div>
    );
  });

  const ThrList = Thr.map((item) => {
    return (
      <div key={item.timeId} className="flex items-baseline">
        <h1 className="mx-4">{item.start}</h1>
        <BsDashLg className="mt-2" />
        <h1 className="mx-4">{item.end}</h1>
        <FaTrashCan
          className="mt-4"
          onClick={() => handleDelete(item.timeId)}
        />
      </div>
    );
  });

  const FriList = Fri.map((item) => {
    return (
      <div key={item.timeId} className="flex items-baseline">
        <h1 className="mx-4">{item.start}</h1>
        <BsDashLg className="mt-2" />
        <h1 className="mx-4">{item.end}</h1>
        <FaTrashCan
          className="mt-4"
          onClick={() => handleDelete(item.timeId)}
        />
      </div>
    );
  });

  const SatList = Sat.map((item) => {
    return (
      <div key={item.timeId} className="flex items-baseline">
        <h1 className="mx-4">{item.start}</h1>
        <BsDashLg className="mt-2" />
        <h1 className="mx-4">{item.end}</h1>
        <FaTrashCan
          className="mt-4"
          onClick={() => handleDelete(item.timeId)}
        />
      </div>
    );
  });

  const SunList = Sun.map((item) => {
    return (
      <div key={item.timeId} className="flex items-baseline">
        <h1 className="mx-4">{item.start}</h1>
        <BsDashLg className="mt-2" />
        <h1 className="mx-4">{item.end}</h1>
        <FaTrashCan
          className="mt-4"
          onClick={() => handleDelete(item.timeId)}
        />
      </div>
    );
  });

  async function handleDelete(timeId) {
    await deleteDoc(doc(openTimeRef, timeId));
  }

  async function handleAddTime() {
    if (!Object.values(addTime).includes("")) {
      await addDoc(openTimeRef, addTime);
    } else {
      alert("請填寫完整資訊");
    }
  }

  return (
    <div className="my-12 flex justify-center ">
      <div className="flex w-full justify-center">
        <Card className="ml-12 mt-24 h-72 w-1/3 border-2 border-solid border-gray-400 shadow-[-4px_4px_4px_2px_rgba(0,0,0,0.2)]">
          <div className="relative">
            <h1 className="m-4 text-2xl font-black text-gray-600">
              新增用餐時段
            </h1>

            <Form>
              <Form.Item
                className="mx-6"
                label="時段"
                name="category"
                rules={[
                  {
                    required: true,
                    message: "請點選時段",
                  },
                ]}
              >
                <Select
                  name="week"
                  onChange={(e) => setAddTime({ ...addTime, day: e })}
                  showSearch
                  style={{
                    width: 200,
                  }}
                  placeholder="點選"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "").includes(input)
                  }
                  options={[
                    {
                      value: "星期一",
                      label: "星期一",
                    },
                    {
                      value: "星期二",
                      label: "星期二",
                    },
                    {
                      value: "星期三",
                      label: "星期三",
                    },
                    {
                      value: "星期四",
                      label: "星期四",
                    },
                    {
                      value: "星期五",
                      label: "星期五",
                    },
                    {
                      value: "星期六",
                      label: "星期六",
                    },
                    {
                      value: "星期日",
                      label: "星期日",
                    },
                  ]}
                />
              </Form.Item>

              <Form.Item
                className="mx-6"
                label="開始時間"
                name="start"
                rules={[
                  {
                    required: true,
                    message: "請選擇開始時間!",
                  },
                ]}
              >
                <TimePicker
                  minuteStep={30}
                  format={format}
                  onChange={(e) => {
                    setAddTime({ ...addTime, start: e.format("HH:mm") });
                  }}
                />
              </Form.Item>

              <Form.Item
                className="mx-6"
                label="結束時間"
                name="end"
                rules={[
                  {
                    required: true,
                    message: "請選擇結束時間!",
                  },
                ]}
              >
                <TimePicker
                  minuteStep={30}
                  format={format}
                  onChange={(e) =>
                    setAddTime({ ...addTime, end: e.format("HH:mm") })
                  }
                />
              </Form.Item>
            </Form>
          </div>

          <Button
            className="absolute bottom-2 right-4 mt-6 block h-10 rounded-lg bg-[#ff850e] px-4 text-center text-lg font-black text-white shadow-lg"
            onClick={handleAddTime}
            type="primary"
            htmlType="button"
          >
            新增
          </Button>
        </Card>

        <Card className="mx-10 my-6 w-[500px] border-2 border-solid border-gray-400 shadow-[-4px_4px_4px_2px_rgba(0,0,0,0.2)]">
          <ScrollShadow
            size={0}
            hideScrollBar
            className="h-[calc(100vh-300px)] w-full justify-center"
          >
            <h1 className="m-4 text-2xl font-black text-gray-600">用餐時段</h1>

            <div className="mx-12 mb-6">
              <h1 className="w-24 rounded-md bg-amber-800 text-center text-xl font-bold leading-8 text-white">
                星期一
              </h1>
              <div>{MonList}</div>
            </div>

            <div className="mx-12 my-6">
              <h1 className="w-24 rounded-md bg-amber-800 text-center text-xl font-bold leading-8 text-white">
                星期二
              </h1>
              <div>{TueList}</div>
            </div>

            <div className="mx-12 my-6">
              <h1 className="w-24 rounded-md bg-amber-800 text-center text-xl font-bold leading-8 text-white">
                星期三
              </h1>
              <div>{WedList}</div>
            </div>

            <div className="mx-12 my-6">
              <h1 className="w-24 rounded-md bg-amber-800 text-center text-xl font-bold leading-8 text-white">
                星期四
              </h1>
              <div>{ThrList}</div>
            </div>

            <div className="mx-12 my-6">
              <h1 className="w-24 rounded-md bg-amber-800 text-center text-xl font-bold leading-8 text-white">
                星期五
              </h1>
              <div>{FriList}</div>
            </div>

            <div className="mx-12 my-6">
              <h1 className="w-24 rounded-md bg-amber-800 text-center text-xl font-bold leading-8 text-white">
                星期六
              </h1>
              <div>{SatList}</div>
            </div>

            <div className="mx-12 my-6">
              <h1 className="w-24 rounded-md bg-amber-800 text-center text-xl font-bold leading-8 text-white">
                星期日
              </h1>
              <div>{SunList}</div>
            </div>
          </ScrollShadow>
        </Card>
      </div>
    </div>
  );
}

export default OpenTime;
