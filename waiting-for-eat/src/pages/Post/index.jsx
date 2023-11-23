import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import db from "../../firebase";

//取得html
async function getHtml({ setPost }) {
  const postRef = doc(db, "post", "kR0VeTSdZfz0pLBAnF0y");
  const docSnap = await getDoc(postRef);

  if (docSnap.exists()) {
    // console.log("Document data:", docSnap.data());
    const download = docSnap.data();

    setPost(download);
  } else {
    console.log("No such document!");
  }
}

function Post() {
  const [post, setPost] = useState({});
  useEffect(() => {
    getHtml({ setPost });
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: post.content }}></div>;
}

export default Post;
