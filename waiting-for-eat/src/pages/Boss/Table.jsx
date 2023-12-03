import { PushpinOutlined } from "@ant-design/icons";
import { Button, Form, Input, Menu } from "antd";
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
import { FaTrashCan } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import db from "../../firebase";
import "./table.css";

const rootSubmenuKeys = [];

function Table() {
  const { companyId } = useParams();
  const [openKeys, setOpenKeys] = useState(["sub1"]);
  const [tables, setTables] = useState([]);
  const [addTable, setAddTable] = useState({ number: "", people: "" });
  const companyRef = collection(db, "company");
  const tableRef = query(collection(companyRef, companyId, "table"));

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
  }, []);

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  //排桌號
  let tableList = tables.sort((firstItem, secondItem) =>
    firstItem.number > secondItem.number ? 1 : -1,
  );

  //先查看有沒有這個人數的類別
  let items = [];
  tableList.map((tableInfo) => {
    const peopleItem = items.find((item) => {
      return item.label == tableInfo.people + "人桌";
    });

    if (peopleItem != undefined) {
      const children = {
        icon: tableInfo.number,
        key: tableInfo.number,
        label: (
          <FaTrashCan
            className="ml-36"
            onClick={() => {
              handleDelete(tableInfo.tableId);
            }}
          />
        ),
      };
      peopleItem.children.push(children);
    } else {
      const newItem = {
        label: tableInfo.people + "人桌",
        key: "sub" + tableInfo.people,
        icon: <PushpinOutlined />,
        children: [
          {
            icon: tableInfo.number,
            key: tableInfo.number,
            label: (
              <FaTrashCan
                className="ml-36"
                onClick={() => {
                  handleDelete(tableInfo.tableId);
                }}
              />
            ),
          },
        ],
      };
      items.push(newItem);
      rootSubmenuKeys.push("sub" + tableInfo.people);
    }
  });

  //按照人數排桌號
  items = items.sort((firstItem, secondItem) =>
    firstItem.label > secondItem.label ? 1 : -1,
  );

  async function handleDelete(tableId) {
    await deleteDoc(doc(tableRef, tableId));
  }

  async function handleAddTable() {
    if (!Object.values(addTable).includes("")) {
      console.log(addTable);
      await addDoc(tableRef, addTable);
    } else {
      alert("請填寫完整資訊");
    }
  }

  console.log(addTable);

  return (
    <>
      <div className="border-2 border-solid border-black">
        <h1 className="mx-6 my-8 text-4xl font-bold">新增桌位</h1>
        <Form>
          <Form.Item
            label="桌號"
            name="number"
            rules={[
              {
                required: true,
                message: "請輸入桌號!",
              },
            ]}
          >
            <Input
              name="number"
              onChange={(e) =>
                setAddTable({ ...addTable, number: e.target.value })
              }
              value={addTable.number}
            />
          </Form.Item>

          <Form.Item
            label="人數"
            name="people"
            rules={[
              {
                required: true,
                message: "請輸入桌號!",
              },
            ]}
          >
            <Input
              name="people"
              onChange={(e) =>
                setAddTable({ ...addTable, people: e.target.value })
              }
              value={addTable.number}
            />
          </Form.Item>

          <Button
            className="mx-6 mb-6 bg-[#1677ff]"
            onClick={handleAddTable}
            type="primary"
            htmlType="button"
          >
            Submit
          </Button>
        </Form>
      </div>
      <h1 className="my-8 text-4xl font-bold">桌位列表</h1>
      <Menu
        mode="inline"
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        style={{
          width: 256,
        }}
        items={items}
      />
    </>
  );
}

export default Table;
