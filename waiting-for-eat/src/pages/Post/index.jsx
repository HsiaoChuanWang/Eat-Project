import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import db from "../../firebase";

function Post() {
  const { postId } = useParams();
  const [post, setPost] = useState({});

  async function getHtml() {
    const postRef = doc(db, "post", postId);
    const docSnap = await getDoc(postRef);

    if (docSnap.exists()) {
      const resultPost = docSnap.data();
      setPost(resultPost);
    } else {
      console.log("No such document!");
    }
  }
  useEffect(() => {
    getHtml();
  }, []);

  console.log(post);

  return (
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
  );
}

export default Post;
