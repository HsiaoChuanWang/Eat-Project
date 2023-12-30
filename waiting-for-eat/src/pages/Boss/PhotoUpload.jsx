import { UploadOutlined } from "@ant-design/icons";
import { Card, ScrollShadow } from "@nextui-org/react";
import { Button, Upload } from "antd";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { default as React, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import db, { storage } from "../../firebase";
import useUserStore from "../../stores/userStore.js";

function PhotoUpload() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [mainPictures, setMainpictures] = useState([]);
  const [showMainPicture, setShowMainpicture] = useState("");
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
    navigate(`/boss/photo/${companyId}`);
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
    navigate(`/boss/photo/${companyId}`);
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
    <div className="flex h-full items-center justify-center">
      <Card className="h-3/5 w-2/3 py-4">
        <div className="flex h-1/3">
          <div className="flex w-1/3 flex-col items-center justify-center gap-2">
            <h2 className="text-xl font-bold">上傳封面照片</h2>
            <p className="font-black text-red-600">*僅限單張</p>
          </div>

          <div className="flex w-2/3">
            <div className="flex w-2/3 items-center justify-center">
              <Upload {...mainProps}>
                <Button
                  icon={<UploadOutlined />}
                  className="text-amber-600"
                  style={{ background: "#ffedd5" }}
                >
                  選擇檔案
                </Button>
              </Upload>
            </div>

            <div className="relative w-1/3 self-end">
              <Button
                type="primary"
                onClick={handleMain}
                disabled={mainPictures.length === 0}
                className="absolute bottom-2 right-8 w-24"
              >
                上傳封面
              </Button>
            </div>
          </div>
        </div>

        <div className="w-[calc(100%-24px)] self-center border-b border-solid border-gray-300 py-2"></div>
        <div className="w-[calc(100%-24px)] self-center border-t border-solid border-gray-300 py-2"></div>

        <div className="flex h-[calc(67%-24px)]">
          <div className="flex w-1/3 flex-col items-center justify-center gap-2">
            <h2 className="text-xl font-bold">上傳菜單照片</h2>
            <p className="font-black text-red-600">*可選擇多張上傳</p>
          </div>

          <div className="flex w-2/3">
            <div className="flex w-2/3 items-center justify-center">
              <ScrollShadow
                size={0}
                hideScrollBar
                className="h-[calc(100%-12px)]"
              >
                <Upload {...menuProps}>
                  <Button
                    icon={<UploadOutlined />}
                    className="text-amber-600"
                    style={{ background: "#ffedd5" }}
                  >
                    選擇檔案
                  </Button>
                </Upload>
              </ScrollShadow>
            </div>

            <div className="relative w-1/3 self-end">
              <Button
                className="absolute bottom-4 right-8 w-24"
                type="primary"
                onClick={handleMenu}
                disabled={menuPictures.length === 0}
                style={{
                  marginTop: 16,
                }}
              >
                上傳菜單
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default PhotoUpload;
