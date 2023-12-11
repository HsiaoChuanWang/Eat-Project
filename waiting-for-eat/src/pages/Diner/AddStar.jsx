import { Rate } from "antd";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { default as React, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import db from "../../firebase";
import useStarStore from "../../stores/starStore";

function AddStar() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [star, setStar] = useState(0);
  const [content, setContent] = useState("");
  const [starList, setStarList] = useState([]);
  const companyId = useStarStore((state) => state.companyId);
  const orderId = useStarStore((state) => state.orderId);
  const companyName = useStarStore((state) => state.companyName);
  const starq = query(
    collection(db, "star"),
    where("companyId", "==", companyId),
  );

  useEffect(() => {
    let starList = [];
    getDocs(starq).then((result) => {
      result.forEach((doc) => {
        const result = doc.data();
        const resultStar = result.star;
        const resultId = doc.id;
        const combine = { ...result, starId: resultId };
        starList.push(resultStar);
      });
      setStarList(starList);
    });
  }, []);

  async function UpdateTotalStar() {
    const newStarList = [...starList, star];
    const sumStar = newStarList.reduce((a, c) => a + c, 0);
    const avg = sumStar / (starList.length + 1);

    const companyRef = doc(db, "company", companyId);
    await updateDoc(companyRef, {
      totalStar: avg,
    });
  }

  async function handleSend() {
    const starRef = await addDoc(collection(db, "star"), {
      orderId: orderId,
      companyId: companyId,
      userId: userId,
      star: star,
      content: content,
      createTime: serverTimestamp(),
    });

    UpdateTotalStar();
  }

  return (
    <>
      <div>
        <div className="popup-content w-[600px] border-2 border-solid border-black bg-white p-20 font-bold">
          <h1>{companyName}</h1>
          <Rate
            className="block px-20 text-4xl"
            onChange={(e) => {
              setStar(e);
            }}
            value={star}
          />

          <textarea
            className="h-96 w-96 border-2 border-solid border-black"
            size="lg"
            onChange={(e) => {
              setContent(e.target.value);
            }}
            value={content}
          />

          <div>
            <button
              className="border-2 border-solid border-black "
              onClick={() => {
                setStar("");
                setContent("");
                navigate(`/diner/eatenShop/${userId}`);
              }}
            >
              取消
            </button>
            <button
              className="border-2 border-solid border-black"
              onClick={() => {
                navigate(`/diner/eatenShop/${userId}`);
                handleSend();
              }}
            >
              送出
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddStar;
