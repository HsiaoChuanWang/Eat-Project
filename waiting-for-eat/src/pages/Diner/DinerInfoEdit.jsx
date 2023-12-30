import { Card } from "@nextui-org/react";
import { Button, Form, Input, Radio } from "antd";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import db, { storage } from "../../firebase";
import useUserStore from "../../stores/userStore.js";

function DinerInfoEdit() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const detailInfo = useUserStore((state) => state.detailInfo);
  const [updateData, setUpdateData] = useState({
    userName: detailInfo.userName,
    gender: detailInfo.gender,
    phone: detailInfo.phone,
  });

  async function handlePicture(picture) {
    const storageRef = ref(storage, userId);
    await uploadBytes(storageRef, picture);
    const downloadURL = await getDownloadURL(storageRef);
    setUpdateData({ ...updateData, picture: downloadURL });
  }

  async function handleUpdate() {
    const userRef = doc(db, "user", userId);
    await updateDoc(userRef, updateData);
    navigate(`/diner/dinerInfo/${userId}`);
  }

  return (
    <div className="flex h-full items-center justify-center">
      <Card className="w-2/3">
        <div className="relative mt-8">
          <h2 className="mb-2 ml-20 text-2xl font-bold">個人資訊</h2>
          <div className="mx-auto w-4/5 border-t-2 border-solid border-gray-400 pb-2"></div>
          <Form className="ml-20">
            <div className="flex items-center">
              <h1 className="my-4 mr-6 w-28 text-base font-semibold [text-align-last:justify]">
                姓名
              </h1>
              <Input
                className="h-8 w-28"
                name="userName"
                onChange={(e) =>
                  setUpdateData({ ...updateData, userName: e.target.value })
                }
                value={updateData.userName}
              />
            </div>

            <div className="flex items-center">
              <h1 className="my-4 mr-6 w-28 text-base font-semibold [text-align-last:justify]">
                性別
              </h1>
              <Radio.Group
                className="font-black"
                name="gender"
                onChange={(e) =>
                  setUpdateData({ ...updateData, gender: e.target.value })
                }
                value={updateData.gender}
              >
                <Radio value="小姐">女</Radio>
                <Radio value="先生">男</Radio>
              </Radio.Group>
            </div>

            <div className="flex items-center">
              <h1 className="my-4 mr-6 w-28 text-base font-semibold [text-align-last:justify]">
                手機
              </h1>
              <Input
                className="h-8 w-64"
                name="phone"
                onChange={(e) =>
                  setUpdateData({ ...updateData, phone: e.target.value })
                }
                value={updateData.phone}
              />
            </div>

            <div className="mb-4 flex  items-center">
              <h1 className="my-4 mr-6 w-28 text-base font-semibold [text-align-last:justify]">
                上傳大頭照
              </h1>
              <Input
                className="h-8 w-64 text-xs"
                type="file"
                accept="image/*"
                name="picture"
                onChange={(e) => handlePicture(e.target.files[0])}
              />
            </div>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button
                style={{ background: "#b0aba5", cursor: "pointer" }}
                className="absolute bottom-0 right-36  font-bold"
                onClick={() => navigate(`/diner/dinerInfo/${userId}`)}
                type="primary"
                htmlType="button"
              >
                返回
              </Button>

              <Button
                className="absolute bottom-0 right-16 font-bold"
                onClick={handleUpdate}
                type="primary"
                htmlType="button"
              >
                更新
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </div>
  );
}

export default DinerInfoEdit;
