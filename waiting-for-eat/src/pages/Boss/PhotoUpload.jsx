import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Upload } from "antd";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { default as React, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import db, { storage } from "../../firebase";
import useUserStore from "../../stores/userStore";

function PhotoUpload() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [mainPictures, setMainpictures] = useState([]);
  const detailInfo = useUserStore((state) => state.detailInfo);
  const [menuPictures, setMenuPictures] = useState([]);

  const mainProps = {
    onRemove: (file) => {
      const index = mainPictures.indexOf(file);
      const newFileList = mainPictures.slice();
      newFileList.splice(index, 1);
      setMainpictures(newFileList);
    },
    beforeUpload: (file) => {
      setMainpictures([file]);
      return false;
    },
    mainPictures,
    maxCount: 1,
  };

  async function getUrl(picture) {
    const uuid = uuidv4();
    const storageRef = ref(storage, uuid);
    await uploadBytes(storageRef, picture);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  }

  async function uploadMain(url) {
    const docId = detailInfo.companyId;
    const companyRef = doc(db, "company", docId);
    await updateDoc(companyRef, {
      picture: url,
    });
  }

  const handleMain = () => {
    const main = mainPictures[0];
    getUrl(main).then((url) => {
      uploadMain(url);
    });
  };

  const menuProps = {
    onRemove: (file) => {
      const index = menuPictures.indexOf(file);
      const newFileList = menuPictures.slice();
      newFileList.splice(index, 1);
      setMenuPictures(newFileList);
    },
    beforeUpload: (file) => {
      setMenuPictures([...menuPictures, file]);
      return false;
    },
    fileList: menuPictures,
  };

  async function uploadMenu(urls) {
    const docId = detailInfo.companyId;
    const companyRef = doc(db, "company", docId);
    await updateDoc(companyRef, {
      menu: urls,
    });
    navigate(`/boss/photoUpload/${companyId}`);
  }

  const handleMenu = () => {
    let menuUrls = [];
    menuPictures.forEach((file) => {
      getUrl(file)
        .then((url) => {
          menuUrls.push(url);
        })
        .then(() => {
          uploadMenu(menuUrls);
        });
      navigate(`/boss/photoUpload/${companyId}`);
    });
  };

  return (
    <Form>
      <h2 className="p-6 text-center text-xl">上傳封面照片</h2>
      <p>*僅限單張</p>

      <Upload {...mainProps}>
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>
      <Button
        className="bg-red-200"
        type="primary"
        onClick={handleMain}
        disabled={mainPictures.length === 0}
        style={{
          marginTop: 16,
        }}
      >
        {"確認上傳"}
      </Button>

      <h2 className="p-6 text-center text-xl">上傳菜單照片</h2>
      <p>*可選擇多張上傳</p>
      <div>
        <Upload {...menuProps}>
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>
        <Button
          className="bg-red-200"
          type="primary"
          onClick={handleMenu}
          disabled={menuPictures.length === 0}
          style={{
            marginTop: 16,
          }}
        >
          {"確認上傳"}
        </Button>
      </div>
    </Form>
  );
}

export default PhotoUpload;
