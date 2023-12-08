import dateFormat from "dateformat";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { default as React, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import db from "../../firebase";

function Post() {
  const navigation = useNavigate();
  const { postId } = useParams();
  const [post, setPost] = useState({});
  const [postList, setPostList] = useState([]);

  async function getHtml() {
    const postRef = doc(db, "post", postId);
    const docSnap = await getDoc(postRef);

    if (docSnap.exists()) {
      const resultPost = docSnap.data();
      setPost(resultPost);
      return resultPost;
    } else {
      console.log("No such document!");
    }
  }

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
    getHtml().then((postData) => {
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
            }
          });
        });
    });
  }, [postId]);

  const posts = postList
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
    <div className="m-8 mb-48 flex">
      <div className="p-20">
        <h2 className="text-2xl font-bold">{post.title}</h2>
        <br />
        {/* <h2>{post.createdDate}</h2> */}
        <div className="flex">
          <img src={post.picture} className="w-20" />
          <h2>{post.userName}</h2>
        </div>
        <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
      </div>
      <div>{posts}</div>
    </div>
  );
}

export default Post;
