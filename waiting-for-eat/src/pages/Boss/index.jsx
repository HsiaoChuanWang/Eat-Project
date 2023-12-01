import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import db, { storage } from "../../firebase";
import useUserStore from "../../stores/userStore";

function Boss() {
  const [mainPicture, setMainpicture] = useState("");
  const detailInfo = useUserStore((state) => state.detailInfo);
  async function updateMainPicture(url) {
    const docId = detailInfo.companyId;
    const companyRef = doc(db, "company", docId);

    await updateDoc(companyRef, {
      picture: url,
    });
  }

  async function handlePicture(picture) {
    const storageRef = ref(storage, detailInfo.companyId);
    await uploadBytes(storageRef, picture);
    const downloadURL = await getDownloadURL(storageRef);
    setMainpicture(downloadURL);
  }

  const handleData = (e) => {
    const file = e.target.files[0];
    handlePicture(file);
  };

  const handleClick = () => {
    updateMainPicture(mainPicture);
  };

  return (
    <>
      <div>我是業者專區</div>
      <label>上傳照片</label>
      <input
        type="file"
        accept="image/*"
        name="picture"
        onChange={(e) => handleData(e)}
      />
      <button onClick={handleClick}>上傳封面照片</button>

      {/* <h2>上傳菜單照片</h2> */}
    </>
  );
}

export default Boss;
