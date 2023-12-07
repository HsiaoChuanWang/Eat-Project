import { Button, Form, Input, Radio } from "antd";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import db, { storage } from "../../firebase";
import useUserStore from "../../stores/userStore";

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

  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <h2 className="p-6 text-center text-xl">基本資料</h2>
      <Form
        className="m-4"
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item label="姓名">
          <Input
            name="userName"
            onChange={(e) =>
              setUpdateData({ ...updateData, userName: e.target.value })
            }
            value={updateData.userName}
          />
        </Form.Item>

        <Form.Item label="性別">
          <Radio.Group
            name="gender"
            onChange={(e) =>
              setUpdateData({ ...updateData, gender: e.target.value })
            }
            value={updateData.gender}
          >
            <Radio value="小姐">女</Radio>
            <Radio value="先生">男</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="手機">
          <Input
            name="phone"
            onChange={(e) =>
              setUpdateData({ ...updateData, phone: e.target.value })
            }
            value={updateData.phone}
          />
        </Form.Item>

        <Form.Item label="上傳大頭照">
          <Input
            type="file"
            accept="image/*"
            name="picture"
            onChange={(e) => handlePicture(e.target.files[0])}
          />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button
            className="bg-[#1677ff]"
            onClick={handleUpdate}
            type="primary"
            htmlType="button"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default DinerInfoEdit;
