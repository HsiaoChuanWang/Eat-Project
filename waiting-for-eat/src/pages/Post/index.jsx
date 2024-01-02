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
import { default as React, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "../../components/Alert/index.jsx";
import db from "../../firebase";
import useUserStore from "../../stores/userStore.js";
import logologo from "./logologo.jpg";

function Post() {
  const navigation = useNavigate();
  const { postId } = useParams();
  const [companyData, setCompanyData] = useState({});
  const [post, setPost] = useState({});
  const [postList, setPostList] = useState([]);
  const [mainPoster, setMainPoster] = useState({});
  const [mainTime, setMainTime] = useState("");
  const userId = useUserStore((state) => state.userId);

  async function getHtml() {
    const postRef = doc(db, "post", postId);
    const docSnap = await getDoc(postRef);

    const resultPost = docSnap.data();
    setPost(resultPost);
    return resultPost;
  }

  async function getCompanyData(companyId) {
    const docRef = doc(db, "company", companyId);
    const docSnap = await getDoc(docRef);

    const data = docSnap.data();
    const resultData = { ...data, companyId: companyId };
    setCompanyData(resultData);
  }

  async function getPosterInfo(userId) {
    const docRef = doc(db, "user", userId);
    const docSnap = await getDoc(docRef);

    const resultUser = docSnap.data();
    return resultUser;
  }

  useEffect(() => {
    getHtml().then((postData) => {
      getCompanyData(postData.companyId);

      const postq = query(
        collection(db, "post"),
        where("companyId", "==", postData.companyId),
      );

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
          let mainPost = [];
          posts.forEach((post) => {
            if (post.postId != postId) {
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
                  setPostList([...combinePosts]);
                });
            } else {
              getPosterInfo(post.userId)
                .then((data) => {
                  const newData = {
                    ...post,
                    userName: data.userName,
                    picture: data.picture,
                  };
                  mainPost.push(newData);
                })
                .then(() => {
                  const result = mainPost[0];
                  const time = dateFormat(
                    result.createTime.toDate(),
                    "yyyy/mm/dd HH:MM",
                  );
                  setMainTime(time);
                  setMainPoster(result);
                });
            }
          });
        });
    });
  }, [postId]);

  const posts = postList
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
    <div className="flex justify-center">
      <Alert />
      <div className="m-8 flex w-full max-w-[1400px] justify-between">
        <div className="w-3/4 pr-10">
          <h2 className="text-5xl font-black text-[#134f6c]">{post.title}</h2>

          <div className="my-4 flex items-center">
            <div className="mr-4 rounded border-2 border-solid border-lime-400  bg-lime-200 px-1 text-lg font-bold">
              {mainPoster.userName}
            </div>
            <p className="text-base font-bold">{mainTime}</p>
          </div>

          <img
            src={mainPoster.mainPicture}
            className="h-[500px] w-full object-cover object-center"
          />

          <div
            className="mt-4"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>

          <Card className=" mt-8 w-3/4 bg-gradient-to-tr from-gray-300 to-stone-200 p-4 shadow-lg">
            <div className="flex justify-between">
              <div className="flex ">
                <img
                  onClick={() => {
                    navigation(`/restaurant/${companyData.companyId}`);
                  }}
                  className="h-full w-[250px] cursor-pointer rounded-2xl object-cover object-center"
                  src={companyData.picture}
                />

                <div className="py-4 pl-6">
                  <h1 className="text-2xl font-black">{companyData.name}</h1>
                  <h1 className="my-2 font-bold">
                    {companyData.city}
                    {companyData.district}
                    {companyData.address}
                  </h1>
                  <h1 className="font-bold">{companyData.phone}</h1>
                </div>
              </div>

              <div className="mr-14">
                <Button
                  radius="full"
                  className="my-6 block h-11 rounded-lg bg-[#ff850e] px-4 text-center text-lg font-black text-white shadow-lg"
                  onClick={() => {
                    if (userId === "") {
                      toast.error("請登入以進行預約");
                    } else {
                      navigation(`/reserve/${companyData.companyId}`);
                    }
                  }}
                >
                  前往訂位
                </Button>
                <Button
                  radius="full"
                  className="block h-11 rounded-lg bg-[#b0aba5] px-4 text-center text-lg font-black text-white shadow-lg"
                  onClick={() => navigation(`/`)}
                >
                  返回首頁
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="sticky top-28 mx-2 h-[calc(100vh-148px)] w-1/4 px-2 shadow-[-4px_0_4px_2px_rgba(0,0,0,0.16)]">
          <h2 className="mt-2 text-2xl font-bold text-gray-500">相關食記</h2>
          <ScrollShadow hideScrollBar className="h-[calc(100vh-196px)] w-full">
            {posts[0] === undefined ? (
              <div className="my-4">
                <Card className="flex h-36 w-full items-center justify-center border  border-solid border-gray-400 shadow-xl">
                  <div className="flex items-center justify-center">
                    <img src={logologo} className="h-20" />
                    <h3 className="text-xl font-bold text-gray-600 ">
                      痴吃等待你新增食記
                    </h3>
                  </div>
                </Card>
              </div>
            ) : (
              posts
            )}
          </ScrollShadow>
        </div>
      </div>
    </div>
  );
}

export default Post;
