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
import { useNavigate, useParams } from "react-router-dom";
import Comment from "../../components/Comment";
import db from "../../firebase";
import useUserStore from "../../stores/userStore";
import Like from "./Like";

function Restaurant() {
  const navigation = useNavigate();
  const { companyId } = useParams();
  const [data, setData] = useState({});
  const [post, setPost] = useState([]);
  const userInfo = useUserStore((state) => state.userInfo);
  const postq = query(
    collection(db, "post"),
    where("companyId", "==", companyId),
  );

  async function getCompanyData() {
    const docRef = doc(db, "company", companyId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const resultData = docSnap.data();
      setData(resultData);
    } else {
      console.log("No company data document in boss page!");
    }
  }

  async function getPosterInfo(userId) {
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
    getCompanyData();
    getDocs(postq)
      .then((quarySnaps) => {
        let posts = [];
        quarySnaps.forEach((doc) => {
          const result = doc.data();
          const resultId = doc.id;
          const combineResult = { ...result, postId: resultId };
          posts.push(combineResult);
        });
        return posts;
      })
      .then((posts) => {
        let combinePosts = [];
        posts.forEach((post) => {
          getPosterInfo(post.userId)
            .then((data) => {
              const newData = {
                ...post,
                userName: data.userName,
                picture: data.picture,
              };
              combinePosts.push(newData);
            })
            .then(() => {
              setPost([...combinePosts]);
            });
        });
      });
  }, []);

  const posts = post
    .sort((a, b) => (a.createTime > b.createTime ? 1 : -1))
    .map((item) => {
      return (
        <div
          key={item.userId}
          className="my-4 border-2 border-solid border-black px-4"
        >
          <h2>{dateFormat(item.createTime.toDate(), "yyyy/mm/dd HH:MM")}</h2>
          <div
            onClick={() => {
              navigation(`/post/${item.postId}`);
            }}
          >
            <div className="flex items-center">
              <img src={item.picture} className="w-20" />
              <h2>{item.userName}</h2>
            </div>

            <div className="flex">
              <p className="my-6  text-xl">標題</p>
              <p className="mx-4  my-6 text-xl">|</p>
              <p className="my-6  text-xl">{item.title}</p>
            </div>
          </div>
        </div>
      );
    });

  return (
    <div>
      <div className="m-8 mb-48 flex">
        <div className="w-1/2">
          <div className="border-2 border-solid border-black px-2">
            <h1 className="text-4xl">餐廳資訊</h1>
            <div className="flex">
              <Like />
            </div>

            <img src={data.picture} />
            <h2>{data.name}</h2>
            <h4>
              {data.city}
              {data.district}
              {data.address}
            </h4>
            <h2>{data.phone}</h2>
          </div>

          <div className="my-4 border-2 border-solid border-black px-2">
            <h4 className="text-4xl">評論們</h4>
            <Comment />
          </div>

          <div className="my-4 border-2 border-solid border-black px-2">
            <h3 className="text-4xl">菜單</h3>
            <div className=" flex  w-48 p-4">
              {data.menu ? (
                data.menu.map((picture, index) => (
                  <img className="px-2" src={picture} key={index} />
                ))
              ) : (
                <h4>暫無上傳菜單</h4>
              )}
            </div>
          </div>

          <div className="my-4 border-2 border-solid border-black px-2">
            <h1 className="text-4xl">現熱活動</h1>
            <div dangerouslySetInnerHTML={{ __html: data.description }}></div>
          </div>
        </div>
        <div className="mx-2 w-1/2 border-2 border-solid border-black  px-2">
          <h2 className="text-4xl">相關食記</h2>
          {posts}
        </div>
      </div>

      <div
        className="fixed bottom-24 flex w-full justify-center"
        onClick={() => {
          if (userInfo.userId === "") {
            alert("請登入以進行預約");
          } else {
            navigation(`/reserve/${companyId}`);
          }
        }}
      >
        <button className=" w-1/2 border-2 border-solid border-black bg-orange-300 text-center text-2xl">
          線上預約
        </button>
      </div>
    </div>
  );
}

export default Restaurant;
