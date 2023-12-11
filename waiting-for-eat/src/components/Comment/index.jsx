import dateFormat from "dateformat";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import db from "../../firebase";

import { Rate } from "antd";

function Comment() {
  const { companyId } = useParams();
  const [comment, setComment] = useState([]);
  const q = query(collection(db, "star"), where("companyId", "==", companyId));

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
    getDocs(q)
      .then((quarySnaps) => {
        let comments = [];
        quarySnaps.forEach((doc) => {
          const result = doc.data();
          comments.push(result);
        });
        return comments;
      })
      .then((comments) => {
        let combineComment = [];
        comments.forEach((comment) => {
          getUserInfo(comment.userId)
            .then((data) => {
              const newData = {
                ...comment,
                userName: data.userName,
                picture: data.picture,
              };
              combineComment.push(newData);
            })
            .then(() => {
              setComment(combineComment);
            });
        });
      });
  }, []);

  const comments = comment
    .sort((a, b) => (a.createTime > b.createTime ? -1 : 1))
    .map((item, index) => {
      return (
        <div key={index} className="border-2 border-solid border-black">
          <Rate disabled allowHalf defaultValue={item.star} />
          <h2>{dateFormat(item.createTime.toDate(), "yyyy/mm/dd HH:MM")}</h2>
          <div></div>
          <div className="flex">
            <img src={item.picture} className="w-20" />
            <h2>{item.userName}</h2>
          </div>
          <h2>這是內容</h2>
          <h2>{item.content}</h2>
        </div>
      );
    });

  return (
    <div className="w-full">
      <div className=" p-2">{comments}</div>
    </div>
  );
}

export default Comment;
