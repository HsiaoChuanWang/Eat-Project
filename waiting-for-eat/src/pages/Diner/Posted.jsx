import dateFormat from "dateformat";
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
import { useNavigate, useParams } from "react-router-dom";
import db from "../../firebase";

function Posted({ setContent }) {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [combineData, setCombineData] = useState([]);
  const postq = query(collection(db, "post"), where("userId", "==", userId));

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
    const postSnap = onSnapshot(postq, (result) => {
      let postList = [];
      result.forEach((doc) => {
        const data = doc.data();
        const dataId = doc.id;
        const combine = { ...data, postId: dataId };
        postList.push(combine);
      });

      let orderList = [];
      postList.forEach((item) => {
        getCompanyInfo(item.companyId).then((data) => {
          const newItem = Object.assign(item, data);
          getOrderInfo(newItem.orderId).then((data) => {
            const newnewItem = Object.assign(newItem, data);
            orderList.push(newnewItem);
            setCombineData(orderList);
          });
        });
      });
    });
    return postSnap;
  }, []);

  async function handleDelete(postId) {
    await deleteDoc(doc(db, "post", postId));
  }

  const printDatas =
    combineData.length > 0 ? (
      combineData.map((data) => {
        return (
          <div
            key={data.postId}
            className="relative flex items-center border-2 border-solid border-black"
          >
            <div className="w-64">
              <img
                src={data.mainPicture}
                onClick={() => {
                  navigate(`/post/${data.postId}`);
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
                <p className="my-4  text-xl">食記主題</p>
                <p className="mx-4  my-4 text-xl">|</p>
                <p className="my-4  text-xl">{data.title}</p>
              </div>

              <div className="flex">
                <p className="my-4  text-xl">撰寫時間</p>
                <p className="mx-4  my-4 text-xl">|</p>
                <p className="my-4  text-xl">
                  {dateFormat(data.createTime.toDate(), "yyyy/mm/dd HH:MM")}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                navigate(`/postedEdit/${data.postId}`);
              }}
              className="absolute bottom-16 right-8 h-8 border-2 border-solid border-black"
            >
              編輯
            </button>

            <button
              onClick={() => handleDelete(data.postId)}
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
        <h1 className="text-2xl font-bold">我的食記</h1>
      </div>
      <div>{printDatas}</div>
    </>
  );
}

export default Posted;
