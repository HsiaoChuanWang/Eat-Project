import { Card, ScrollShadow, User } from "@nextui-org/react";
import { Rate } from "antd";
import dateFormat from "dateformat";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import db from "../../firebase";

function Comment() {
  const { companyId } = useParams();
  const [comment, setComment] = useState([]);
  const [show, setShow] = useState(false);
  const q = query(collection(db, "star"), where("companyId", "==", companyId));

  async function setUserId(userId) {
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
          setUserId(comment.userId)
            .then((data) => {
              const newData = {
                ...comment,
                userName: data.userName,
                picture: data.picture,
              };
              combineComment.push(newData);
            })
            .then(() => {
              setComment([...combineComment]);
            });
        });
      });
  }, []);

  const comments = comment
    .sort((a, b) => (a.createTime > b.createTime ? -1 : 1))
    .map((item, index) => {
      return (
        <motion.div
          key={index}
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.15 },
          }}
          whileTap={{ scale: 0.9 }}
          className="w-xs max-w-xs cursor-pointer p-4"
          onClick={() => {
            if (show === false) {
              setShow(true);
            } else {
              setShow(false);
            }
          }}
        >
          <Card className="min-h-[190px]  p-4">
            <div className="flex justify-between">
              <div className="flex items-center">
                <User
                  avatarProps={{
                    src: item.picture,
                    className:
                      "border-2 border-solid border-gray-400 border-opacity-100",
                  }}
                />
                <h3 className="font-bold">{item.userName}</h3>
              </div>

              <p className="text-tiny font-bold">
                {dateFormat(item.createTime.toDate(), "yyyy/mm/dd HH:MM")}
              </p>
            </div>

            <Rate
              disabled
              allowHalf
              defaultValue={item.star}
              className="my-2"
            />

            <h2 className={`${show === false && "line-clamp-4"} text-base`}>
              {item.content}
            </h2>
          </Card>
        </motion.div>
      );
    });

  return (
    <div className="flex w-full justify-center">
      <ScrollShadow hideScrollBar className="h-[720px] w-full">
        <div className="flex flex-wrap">{comments}</div>
      </ScrollShadow>
    </div>
  );
}

export default Comment;
