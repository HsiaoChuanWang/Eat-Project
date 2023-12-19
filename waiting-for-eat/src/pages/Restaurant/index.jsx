import { Button, Card, Image, ScrollShadow, User } from "@nextui-org/react";
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
import { useNavigate, useParams } from "react-router-dom";
import Comment from "../../components/Comment";
import db from "../../firebase";
import useUserStore from "../../stores/userStore";
import Like from "./Like";
import Menu from "./Menu";

function Restaurant() {
  const navigation = useNavigate();
  const { companyId } = useParams();
  const [data, setData] = useState({});
  const [menu, setMenu] = useState([]);
  const [post, setPost] = useState([]);
  const [position, setPosition] = useState(0);
  const [display, setDisplay] = useState(false);
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
      const menuList = resultData.menu;
      setData(resultData);
      setMenu(menuList);
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
    .sort((a, b) => (a.createTime > b.createTime ? -1 : 1))
    .map((item) => {
      return (
        <motion.div
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.15 },
          }}
          whileTap={{ scale: 0.9 }}
          key={item.userId}
          className="my-4 cursor-pointer"
          onClick={() => {
            navigation(`/post/${item.postId}`);
          }}
        >
          <Card className="scale-95 border border-solid border-gray-400 shadow-xl">
            <div className="flex items-center justify-center p-2">
              <Image
                alt="Card background"
                style={{ width: "100px", height: "100px" }}
                className="rounded-xl object-cover object-center"
                src={item.mainPicture}
              />

              <div className="mx-2 w-44 py-2">
                <div className="flex justify-end">
                  <p className="text-tiny font-bold">
                    {dateFormat(item.createTime.toDate(), "yyyy/mm/dd HH:MM")}
                  </p>
                </div>
                <div className="flex items-center">
                  <User
                    avatarProps={{
                      src: item.picture,
                      className: "border-2 border-solid border-gray-400",
                    }}
                  />
                  <h3 className="font-bold">{item.userName}</h3>
                </div>

                <h1 className="line-clamp-2 text-xl font-bold">{item.title}</h1>
              </div>
            </div>
          </Card>
        </motion.div>
      );
    });

  return (
    <div className=" mb-4 flex justify-center">
      <div className="m-8 flex w-full max-w-[1400px] justify-between">
        <div className="mr-8 w-3/4">
          <div className="pb-6">
            <div>
              <img
                src={data.picture}
                className="h-96 w-full object-cover object-center"
              />
            </div>

            <div className="flex justify-between">
              <div className="mt-8">
                <h2 className="text-4xl font-black">{data.name}</h2>
                <h4 className="mt-2">
                  {data.city}
                  {data.district}
                  {data.address}
                </h4>
                <h2 className="mt-2">{data.phone}</h2>
              </div>

              <div className="mt-8 flex">
                <Like />
              </div>
            </div>
          </div>

          <div className="border-t-2 border-solid border-gray-300 pb-6">
            <h3 className="text-2xl font-bold text-[#ff6e06]">菜單</h3>
            <ScrollShadow orientation="horizontal" className="w-full">
              <div className=" flex w-[1000px] p-4">
                {data.menu ? (
                  data.menu.map((picture, index) => (
                    <div className="min-w-[200px]" key={index}>
                      <motion.img
                        whileHover={{
                          scale: 1.1,
                          transition: { duration: 0.15 },
                        }}
                        whileTap={{ scale: 0.9 }}
                        className="cursor-pointer px-2"
                        src={picture}
                        onClick={() => {
                          setPosition(index);
                          setDisplay(true);
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <h4>暫無上傳菜單</h4>
                )}
              </div>
            </ScrollShadow>
          </div>

          <div className={`${display === false && "hidden"}`}>
            <Menu images={menu} position={position} setDisplay={setDisplay} />
          </div>

          <div className="mt-2 border-t-2 border-solid border-gray-300 pb-6">
            <h1 className="text-2xl font-bold text-[#ff6e06]">現熱活動</h1>
            <div
              className="mx-4 mt-4"
              dangerouslySetInnerHTML={{ __html: data.description }}
            ></div>
          </div>

          {/* <div className="flex justify-center">
            <Card className="w-2/3 p-16">
              <div
                className="text-large font-bold"
                dangerouslySetInnerHTML={{ __html: data.description }}
              ></div>
            </Card>
          </div> */}

          <div className="mt-2 border-t-2 border-solid border-gray-300 pb-6">
            <h1 className="text-2xl font-bold text-[#ff6e06]">相關評論</h1>
            <h1 className="text-base font-bold text-gray-400">
              點選評論以展開內容
            </h1>
            <Comment />
          </div>
        </div>

        <div className="sticky top-28 mx-2 h-[calc(100vh-148px)] w-1/4 px-2 shadow-[-4px_0_4px_2px_rgba(0,0,0,0.16)]">
          <h2 className="mt-4 text-2xl font-bold text-gray-400">相關食記</h2>
          <ScrollShadow hideScrollBar className="h-[calc(100vh-196px)] w-full">
            {posts}
          </ScrollShadow>
        </div>
      </div>

      <div className="fixed bottom-4 flex w-full max-w-[1400px]">
        <div className="h-12 w-[calc(75%-24px)] bg-white">
          <Button
            onClick={() => {
              if (userInfo.userId === "") {
                alert("請登入以進行預約");
              } else {
                navigation(`/reserve/${companyId}`);
              }
            }}
            radius="full"
            className="mx-auto h-12 w-full rounded-lg bg-[#ff850e] text-center text-2xl font-black text-white shadow-lg"
          >
            線上預約
          </Button>
        </div>
        <div className="w-1/4"></div>
      </div>
    </div>
  );
}

export default Restaurant;
