import { Rate } from "antd";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { default as React, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import db from "../../firebase";
import useStarStore from "../../stores/starStore";

function StarEdit() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [oldStar, setOldStar] = useState(0);
  const [star, setStar] = useState(0);
  const [content, setContent] = useState("");
  const [starList, setStarList] = useState([]);
  const starId = useStarStore((state) => state.starId);
  const companyName = useStarStore((state) => state.companyName);
  const companyId = useStarStore((state) => state.companyId);
  const starq = query(
    collection(db, "star"),
    where("companyId", "==", companyId),
  );

  useEffect(() => {
    if (companyId) {
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
    }
  }, [companyId]);

  useEffect(() => {
    if (starId) {
      const starRef = doc(db, "star", starId);
      getDoc(starRef).then((result) => {
        const data = result.data();
        setOldStar(data.star);
        setStar(data.star);
        setContent(data.content);
      });
    }
  }, [starId]);

  async function UpdateTotalStar() {
    const newStarList = [...starList, star];
    const sumStar = newStarList.reduce((a, c) => a + c, 0);
    const avg = (sumStar - oldStar) / starList.length;

    const companyRef = doc(db, "company", companyId);
    await updateDoc(companyRef, {
      totalStar: avg,
    });
  }

  async function handleUpdate() {
    const starRef = doc(db, "star", starId);
    await updateDoc(starRef, {
      star: star,
      content: content,
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
            className="w-96 border-2 border-solid border-black"
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
                navigate(`/diner/commented/${userId}`);
              }}
            >
              取消
            </button>
            <button
              className="border-2 border-solid border-black"
              onClick={() => {
                navigate(`/diner/commented/${userId}`);
                handleUpdate();
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

export default StarEdit;
